import {bytes2Char} from "@taquito/utils";
import {IPFS_URI} from "../constants";


async function getAllPlaylistMetadata(id: string): Promise<{
    ipfsUri: string
    address: string
    id: number
} | null> {
    try {
        const response = await fetch(`https://api.mainnet.tzkt.io/v1/bigmaps/146668/keys?active=true&key.nat.eq=${id}`);
        const data = await response.json();
        if (!data || !data?.length) return null;
        return {
            ipfsUri: bytes2Char(data[0].value.ipfs_uri),
            address: data[0].key.address,
            id: data[0].key.nat
        };
    } catch (e) {
        console.log(e)
        return null;
    }
}

const getPlaylistByIdFetcher = async (url: string, id: string) => {
    const playlistMetadata = await getAllPlaylistMetadata(id);
    if (!playlistMetadata) return null;

    const playlistResponse = await fetch(`${IPFS_URI}/${playlistMetadata.ipfsUri.slice(13)}`);
    const playlist = await playlistResponse.json()
    console.log('pl', playlist);
    return {
        playlist: {
            ...playlist.data,
            collectionId: playlistMetadata.id,
            creatorAddress: playlistMetadata.address
        }
    };
}

export const playlistByIdApi = '/api/playlist/id'


export default getPlaylistByIdFetcher;
