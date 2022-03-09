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
    mode: Mode
}

export const PlaylistContext = createContext<IPlaylistContext>({
    playlistCollection: null,
    playlists: [],
    queuedTracks: [],
    currentTrack: null,
    player: null,
    mode: Mode.NORMAL,
});

const PlaylistProvider: FC = ({children}) => {
    const [playlistCollection, setPlaylistCollection] = useState<PlaylistCollection | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [queuedTracks, setQueuedTracks] = useState<ITrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [mode, setMode] = useState<Mode>(Mode.NORMAL);

    useEffect(() => {
        setPlaylistCollection(new PlaylistCollection(setPlaylists));
        const queue = new TrackQueue(setMode, setQueuedTracks);
        setPlayer(new Player(queue, setCurrentTrack));
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
            }}
        >{children}</PlaylistContext.Provider>
    );
};

export default PlaylistProvider;

