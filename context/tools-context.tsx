import {createContext, FC} from 'react';
import useTezos from '../hooks/use-tezos';
import {OperationContentsAndResultTransaction} from "@taquito/rpc";

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
    const {Tezos} = useTezos();

    const getContract = (contract: string) => Tezos.wallet.at(contract);

    const createCollection = async (ipfsUri: string) => {
        try {
            const contract = await getContract(contracts.collection);
            const op = await contract.methods.create_collection(ipfsUri).send();
            await op.confirmation(confirmations);
            console.log(op.hash);

            return op.operationResults();
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const deleteCollection = async (collectionId: string) => {
        try {

            const contract = await getContract(contracts.collection);
            const op = await contract.methods.delete_collection(collectionId)
                .send();
            await op.confirmation(confirmations);
            console.log(op.hash);

            return op.operationResults();
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const updateCollection = async (collectionId: string, ipfsUri: string) => {
        try {

            const contract = await getContract(contracts.collection);
            const op = await contract.methods.update_collection(collectionId,
                ipfsUri).send();
            await op.confirmation(confirmations);
            console.log(op.hash);

            return op.operationResults();
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const pauseCollection = async (collectionId: string) => {
        try {

            const contract = await getContract(contracts.collection);
            const op = await contract.methods.pause_collection(collectionId).send();
            await op.confirmation(confirmations);
            console.log(op.hash);

            return op.operationResults();
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const resumeCollection = async (collectionId: string) => {
        try {
            const contract = await getContract(contracts.collection);
            const op = await contract.methods.resume_collection(collectionId)
                .send();
            await op.confirmation(confirmations);
            console.log(op.hash);

            return op.operationResults();
        } catch (e) {
            console.error(e);
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
