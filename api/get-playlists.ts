import {bytes2Char} from "@taquito/utils";

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
        const response = await fetch(`https://api.mainnet.tzkt.io/v1/bigmaps/146668/keys?active=true&key.nat.in=[${playlistIds.join(',')}]`);
        const data = await response.json();
        if (!data || !data?.length) return null;

        return data.map((d: any) => bytes2Char(d.value.ipfs_uri));
    } catch (e) {
        return null;
    }
}

const getPlaylists = async (address: string) => {
    const playlistIds = await getPlaylistIds(address);
    if (!playlistIds) return null;
    const playlistUris = await getPlaylistIpfsUris(playlistIds);
    const playlistResponses = await Promise.allSettled(
        playlistUris.map((pu: string) => fetch('https://ipfs.io/ipfs/' + pu.slice(13)))
    );

    return (
        await Promise.all(
            playlistResponses
                .filter(p => p.status === 'fulfilled')
                .map(p => (p as PromiseFulfilledResult<any>).value.json())
        )
    ).filter(p => p.collectionType === 'playlist');
}

export default getPlaylists;
