import {useContext} from 'react';
import {IpfsUploadContext} from "../context/ipfs-upload-context";

const useIpfsUpload = () => useContext(IpfsUploadContext);

export default useIpfsUpload;
