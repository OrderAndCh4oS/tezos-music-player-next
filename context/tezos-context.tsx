import {createContext, FC, useEffect, useState} from 'react';
import {TezosToolkit} from '@taquito/taquito';
import {BeaconWallet} from '@taquito/beacon-wallet';
import {NetworkType} from "@airgap/beacon-sdk";

let Tezos: TezosToolkit | null = null;
let wallet: BeaconWallet | null = null;
let network: any | null = null;

if (typeof window !== 'undefined') {
    Tezos = new TezosToolkit('https://mainnet.api.tez.ie');
    wallet = new BeaconWallet({
        name: 'Music Order & Chaos',
        preferredNetwork: NetworkType.MAINNET
    });

    network = {
        type: NetworkType.MAINNET,
        rpcUrl: 'https://mainnet.api.tez.ie'
    };
    Tezos.setWalletProvider(wallet);
}

export const TezosContext = createContext<any>({
    Tezos,
    user: null,
    sync: null,
    unsync: null
});

const TezosProvider: FC = ({children}) => {
    const [auth, setAuth] = useState<any>(null);

    const sync = async () => {
        await wallet!.requestPermissions({network});
        const account = await wallet!.client.getActiveAccount();
        const address = await wallet!.getPKH();
        setAuth({
            address,
            account,
            wallet
        });
    };

    const unsync = async () => {
        await wallet!.client.clearActiveAccount();
        setAuth(null);
    };

    useEffect(() => {
        (async () => {
            const account = await wallet!.client.getActiveAccount();
            if (!account) return;
            const address = await wallet!.getPKH();
            setAuth({
                address,
                account,
                wallet
            });
        })();
    }, []);

    return (
        <TezosContext.Provider
            value={{
                Tezos,
                auth,
                sync,
                unsync
            }}
        >
            {children}
        </TezosContext.Provider>
    );
};

export default TezosProvider;
