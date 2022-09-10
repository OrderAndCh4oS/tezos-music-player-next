import {bytes2Char} from "@taquito/utils";
import {IPFS_URI} from "../constants";

export const allPlaylistsLimit = 12;

async function getAllPlaylistIpfsUris(page: number, limit: number): Promise<{
    ipfsUri: string
    address: string
    id: number
}[] | null> {
    try {
        const offset = (page - 1) * limit;
        const response = await fetch(`https://api.mainnet.tzkt.io/v1/bigmaps/146668/keys?active=true&offset=${offset}&limit=${limit}`);
        const data = await response.json();
        if (!data || !data?.length) return null;
        return data.map((d: any) => ({
            ipfsUri: bytes2Char(d.value.ipfs_uri),
            address: d.key.address,
            id: d.key.nat
        }));
    } catch (e) {
        console.log(e)
        return null;
    }
}

const getAllPlaylistsFetcher = async (url: string, page: number, limit: number) => {
    const playlistUris = await getAllPlaylistIpfsUris(page, limit);
    if (!playlistUris) return null;

    const playlistResponses = await Promise.allSettled(
        playlistUris.map((pu) => fetch(`${IPFS_URI}/${pu.ipfsUri.slice(13)}`))
    );


    const playlists = (
        await Promise.all(
            playlistResponses
                .map(p => {
                    if (p.status !== 'fulfilled') return null;
                    return (p as PromiseFulfilledResult<any>).value.json();
                })
        )
    )
        .map((p: any, i) => ({
            ...p, data: {
                ...p.data,
                collectionId: playlistUris[i].id,
                creatorAddress: playlistUris[i].address
            }
        }))
        .filter(p => p?.collectionType === 'playlist' && p?.metadataVersion !== '0.0.1');

    return {playlists, page, limit, total: 5000};
}

export const playlistsApi = '/api/playlists'


export default getAllPlaylistsFetcher;
