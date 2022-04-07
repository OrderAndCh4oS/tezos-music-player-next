import {createContext, FC, useEffect, useState} from 'react';
import Playlist, {ITrack, Mode} from "../class/playlist";
import Player from "../class/player";
import TrackQueue from "../class/track-queue";
import PlaylistCollection from "../class/playlist-collection";

interface IPlaylistContext {
    playlistCollection: PlaylistCollection | null
    playlists: Playlist[]
    queuedTracks: ITrack[]
    currentTrack: ITrack | null
    player: Player | null
    mode: Mode,
    cursor: number,
    isPlaying: boolean
}

export const PlaylistContext = createContext<IPlaylistContext>({
    playlistCollection: null,
    playlists: [],
    queuedTracks: [],
    currentTrack: null,
    player: null,
    mode: Mode.NORMAL,
    cursor: 0,
    isPlaying: false
});

const PlaylistProvider: FC = ({children}) => {
    const [playlistCollection, setPlaylistCollection] = useState<PlaylistCollection | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [queuedTracks, setQueuedTracks] = useState<ITrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [mode, setMode] = useState<Mode>(Mode.NORMAL);
    const [cursor, setCursor] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        setPlaylistCollection(new PlaylistCollection(setPlaylists));
        const queue = new TrackQueue(setMode, setCursor, setQueuedTracks);
        setPlayer(new Player(queue, setCurrentTrack, setIsPlaying));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                isPlaying
            }}
        >{children}</PlaylistContext.Provider>
    );
};

export default PlaylistProvider;

