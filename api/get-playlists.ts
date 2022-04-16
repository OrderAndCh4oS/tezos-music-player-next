import {bytes2Char} from "@taquito/utils";
import {IPFS_URI} from "../constants";

async function getPlaylistIds(address: string) {
    try {
        const response = await fetch(`https://api.mainnet.tzkt.io/v1/bigmaps/146670/keys?active=true&select=key,value&key.eq=${address}`);
        const data = await response.json();
        if (!data || !data?.[0].value?.length) return null;

        return data?.[0].value;
    } catch (e) {
        return null;
    }
}

async function getPlaylistIpfsUris(playlistIds: any) {
    try {
        const response = await fetch(`https://api.mainnet.tzkt.io/v1/bigmaps/146668/keys?active=true&key.nat.in=[0,${playlistIds.join(',')}]`);
        const data = await response.json();
        if (!data || !data?.length) return null;

        return data.map((d: any) => bytes2Char(d.value.ipfs_uri));
    } catch (e) {
        return null;
    }
}

const getPlaylists = async (address: string) => {
    const playlistIds = await getPlaylistIds(address);
    console.log('playlistIds', playlistIds);
    if (!playlistIds) return null;
    const playlistUris = await getPlaylistIpfsUris(playlistIds);
    console.log('playlistUris', playlistUris);
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
        .map((p: any, i) => ({...p, data: {...p.data, collectionId: playlistIds[i]}}))
        .filter(p => p.collectionType === 'playlist');
}

export default getPlaylists;
