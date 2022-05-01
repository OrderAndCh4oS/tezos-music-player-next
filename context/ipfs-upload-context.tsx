import axios from "axios";
import {createContext, FC, useState} from "react";

const AWS_API_BASE_URL = 'https://zwnyo31rf5.execute-api.eu-west-1.amazonaws.com/dev';
const AWS_WEBSOCKET_URL = 'wss://ipe6zppmci.execute-api.eu-west-1.amazonaws.com/dev';

export const IpfsUploadContext = createContext<any>(null);

const IpfsUploadProvider: FC = ({children}) => {
    const [state, setState] = useState<{filename: string, status: string, ipfsHash?: string}[]>([]);

    const handleIpfsUpload = async (files: { file: Blob, mimeType: string }[]) => {
        console.log('Uploading to S3');
        const filenames = [];
        for(const {file, mimeType} of files) {
            console.log(file, mimeType);
            const presignedUrls = await getPresignedUrls(mimeType);
            const filename = await uploadToS3(
                mimeType,
                file,
                presignedUrls
            );
            console.log('filename:', filename);
            filenames.push(filename);
        }

        setState(filenames.map(filename => ({filename, status: 'PENDING'})));
        return await addToIpfs(filenames);
    }

    async function getPresignedUrls(mimeType: string) {
        const {data: presignedPostUrl} = await axios.get(`${AWS_API_BASE_URL}/presigned-url?fileType=${mimeType}`);
        console.log(mimeType);
        return presignedPostUrl;
    }

    const addToIpfs = async (filePaths: string[]) => {
        console.log('Adding to IPFS');
        return new Promise((resolve, reject) => {
                const socket = new WebSocket(AWS_WEBSOCKET_URL);
                socket.onopen = function (e) {
                    console.log('[open] Connection established');
                    console.log('Sending filePaths');
                    const payload = `{"action":"ipfs-upload","data":{"filenames":"${filePaths.join(',')}"}}`;
                    console.log('payload:', payload);
                    socket.send(payload);
                };
                socket.onmessage = async (event) => {
                    console.log(`[message] Data received from server: ${event.data}`);
                    const response = JSON.parse(event.data);
                    switch (response.status) {
                        case 'ADDING':
                            setState(prevState => (prevState.map(obj => obj.filename === response.filename ? {...obj, status: 'ADDING'} : obj)));
                            break;
                        case 'ADDED':
                            setState(prevState => (prevState.map(obj => obj.filename === response.filename ? {...obj, status: 'ADDED', ipfsHash: response.ipfsHash} : obj)));
                            break;
                        case 'COMPLETE':
                            resolve(true);
                            break;
                        case 'ERROR':
                            reject(response.message);
                            setState([])
                            break;
                    }
                };
                socket.onclose = function (event) {
                    if (event.wasClean) {
                        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                        // Send back IPFS hash
                    } else {
                        console.log('[close] Connection died');
                    }
                    setState([])
                };
                socket.onerror = function (error) {
                    // @ts-ignore
                    console.log(`[error] ${error.message}`);
                    reject('Error');
                    setState([])
                };

            }
        );
    };

    async function uploadToS3(mimeType: string, file: Blob, presignedPostUrl: any) {
        console.log(mimeType);
        const formData = new FormData();
        formData.append('Content-Type', mimeType);
        console.log('presignedPostUrl:', presignedPostUrl);
        Object.entries<any>(presignedPostUrl.fields).forEach(([k, v]) => {
            formData.append(k, v);
        });
        formData.append('file', file);

        const response = await axios.post(presignedPostUrl.url, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).catch(err => {
            console.log('S3 Upload Error:', err);
        });

        console.log('S3 response:', response);

        return presignedPostUrl.filePath;
    }

    return (
        <IpfsUploadContext.Provider value={{
            handleIpfsUpload,
            state,
            setState
        }}>
            {children}
        </IpfsUploadContext.Provider>

    );
};

export default IpfsUploadProvider;
