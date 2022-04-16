import {createContext, FC, useEffect, useState} from 'react';
import Playlist, {ITrack, Mode} from "../class/playlist";
import Player from "../class/player";
import TrackQueue from "../class/track-queue";
import PlaylistCollection from "../class/playlist-collection";
import getPlaylists from "../api/get-playlists";
import useTezos from "../hooks/use-tezos";

interface IPlaylistContext {
    playlistCollection: PlaylistCollection | null
    playlists: Playlist[]
    queuedTracks: ITrack[]
    currentTrack: ITrack | null
    player: Player | null
    mode: Mode
    cursor: number,
    isPlaying: boolean
    onChainPlaylists: any[]
    isPlaylistSavedOnChain: (playlist: any) => boolean
}

export const PlaylistContext = createContext<IPlaylistContext>({
    playlistCollection: null,
    playlists: [],
    queuedTracks: [],
    currentTrack: null,
    player: null,
    mode: Mode.NORMAL,
    cursor: 0,
    isPlaying: false,
    onChainPlaylists: [],
    isPlaylistSavedOnChain: () => false,
});

const PlaylistProvider: FC = ({children}) => {
    const {auth} = useTezos();
    const [playlistCollection, setPlaylistCollection] = useState<PlaylistCollection | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [queuedTracks, setQueuedTracks] = useState<ITrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [mode, setMode] = useState<Mode>(Mode.NORMAL);
    const [cursor, setCursor] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [onChainPlaylists, setOnChainPlaylists] = useState<any | null>()


    useEffect(() => {
        setPlaylistCollection(new PlaylistCollection(setPlaylists, setOnChainPlaylists));
        const queue = new TrackQueue(setMode, setCursor, setQueuedTracks);
        setPlayer(new Player(queue, setCurrentTrack, setIsPlaying));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!auth || onChainPlaylists?.length) return
        (async () => {
            const playlistData = await getPlaylists(auth.address);
            setOnChainPlaylists(playlistData?.map(pd => (pd.data)));
            if (!playlistData) return;
            for (const playlist of playlistData) {
                playlistCollection?.merge(playlist.data)
            }
        })()
    }, [auth]);

    const isPlaylistSavedOnChain = (playlist: any) => {
        const foundPlaylist = onChainPlaylists?.find((ocp: any) => {
            console.log('ids', ocp.id, playlist.id);
            return ocp.id === playlist.id;
        });
        if (!foundPlaylist) {
            console.log('not found')
            return false;
        }
        if (foundPlaylist.tracks.length !== playlist.tracks.length) {
            console.log('length')
            return false;
        }
        for (const track of playlist.tracks) {
            if (!foundPlaylist.tracks.find((t: any) => t.id === track.id)) {
                console.log('track not in found')
                return false;
            }
        }
        for (const track of foundPlaylist.tracks) {
            if (!playlist.tracks.find((t: any) => t.id === track.id)) {
                console.log('track not in passed')
                return false;
            }
        }
        return true;
    }

    return (
        <PlaylistContext.Provider
            value={{
                playlistCollection,
                playlists,
                queuedTracks,
                currentTrack,
                player,
                mode,
                cursor,
                isPlaying,
                onChainPlaylists,
                isPlaylistSavedOnChain,
            }}
        >{children}</PlaylistContext.Provider>
    );
};

export default PlaylistProvider;

