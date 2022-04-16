import {createContext, FC} from 'react';
import useTezos from '../hooks/use-tezos';
import {OperationContentsAndResultTransaction} from "@taquito/rpc";
import useToast from "../hooks/use-toast";

interface IToolsContext {
    createCollection: (ipfsUri: string) => Promise<OperationContentsAndResultTransaction[] | null>;
    updateCollection: (collectionId: string, ipfsUri: string) => Promise<OperationContentsAndResultTransaction[] | null>;
    deleteCollection: (collectionId: string) => Promise<OperationContentsAndResultTransaction[] | null>;
    pauseCollection: (collectionId: string) => Promise<OperationContentsAndResultTransaction[] | null>;
    resumeCollection: (collectionId: string) => Promise<OperationContentsAndResultTransaction[] | null>;
}

export const ToolsContext = createContext<IToolsContext>({
    createCollection: async () => null,
    updateCollection: async () => null,
    deleteCollection: async () => null,
    pauseCollection: async () => null,
    resumeCollection: async () => null,
});

const contracts = {
    collection: 'KT1JuqumBu5xu4ynjQCzAFW3bRxsLPbEqXLm'
};

const confirmations = 2;

const ToolsProvider: FC = ({children}) => {
    const {setMessage, handleCloseToast} = useToast();
    const {Tezos} = useTezos();

    const toastTimeout = 3500;

    const getContract = (contract: string) => Tezos.wallet.at(contract);

    const createCollection = async (ipfsUri: string) => {
        try {
            setMessage('Creating Playlist…');
            const contract = await getContract(contracts.collection);
            const op = await contract.methods.create_collection(ipfsUri).send();
            await op.confirmation(confirmations);
            console.log(op.hash);
            setMessage('Saved playlist');
            setTimeout(() => {
                handleCloseToast();
            }, toastTimeout);
            return op.operationResults();
        } catch (e) {
            console.error(e);
            setMessage('Failed to create playlist')
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return null;
        }
    };

    const deleteCollection = async (collectionId: string) => {
        try {
            setMessage('Deleting playlist…')
            const contract = await getContract(contracts.collection);
            const op = await contract.methods.delete_collection(collectionId)
                .send();
            await op.confirmation(confirmations);
            setMessage('Deleted playlist');
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return op.operationResults();
        } catch (e) {
            console.error(e);
            setMessage('Failed to delete playlist')
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return null;
        }
    };

    const updateCollection = async (collectionId: string, ipfsUri: string) => {
        try {
            setMessage('Updating Playlist…');
            const contract = await getContract(contracts.collection);
            const op = await contract.methods.update_collection(collectionId,
                ipfsUri).send();
            await op.confirmation(confirmations);
            setMessage('Updated playlist');
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return op.operationResults();
        } catch (e) {
            console.error(e);
            setMessage('Failed to update playlist')
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return null;
        }
    };

    const pauseCollection = async (collectionId: string) => {
        try {
            setMessage('Hiding Playlist…');
            const contract = await getContract(contracts.collection);
            const op = await contract.methods.pause_collection(collectionId).send();
            await op.confirmation(confirmations);
            console.log(op.hash);
            setMessage('Playlist is hidden');
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return op.operationResults();
        } catch (e) {
            console.error(e);
            setMessage('Failed to hide playlist')
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return null;
        }
    };

    const resumeCollection = async (collectionId: string) => {
        try {
            setMessage('Showing Playlist…');
            const contract = await getContract(contracts.collection);
            const op = await contract.methods.resume_collection(collectionId)
                .send();
            await op.confirmation(confirmations);
            console.log(op.hash);
            setMessage('Playlist is shown');
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return op.operationResults();
        } catch (e) {
            console.error(e);
            setMessage('Failed to show playlist')
            setTimeout(() => {
                handleCloseToast()
            }, toastTimeout);
            return null;
        }
    };

    return (
        <ToolsContext.Provider
            value={{
                createCollection,
                updateCollection,
                deleteCollection,
                pauseCollection,
                resumeCollection
            }}
        >
            {children}
        </ToolsContext.Provider>
    );
};

export default ToolsProvider;
