import {bytes2Char} from "@taquito/utils";
import {IPFS_URI} from "../constants";

async function getAllPlaylistIpfsUris() {
    try {
        const response = await fetch(`https://api.mainnet.tzkt.io/v1/bigmaps/146668/keys?active=true`);
        const data = await response.json();
        if (!data || !data?.length) return null;

        return data.map((d: any) => bytes2Char(d.value.ipfs_uri));
    } catch (e) {
        return null;
    }
}

const getAllPlaylistsFetcher = async (url: string, page: number, limit = 100) => {
    const playlistUris = await getAllPlaylistIpfsUris();
    const playlistResponses = await Promise.allSettled(
        playlistUris.map((pu: string) => fetch(`${IPFS_URI}/${pu.slice(13)}`))
    );

    return (
        await Promise.all(
            playlistResponses
                .map(p => {
                    if (p.status !== 'fulfilled') return null;
                    return (p as PromiseFulfilledResult<any>).value.json();
                })
        )
    )
        .filter(p => p?.collectionType === 'playlist');
}

export const playlistsApi = '/api/playlists'


export default getAllPlaylistsFetcher;
