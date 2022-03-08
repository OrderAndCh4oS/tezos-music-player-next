import {createContext, Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import Playlist, {ITrack, Mode} from "../class/playlist";
import Player from "../class/player";
import TrackQueue from "../class/track-queue";
import PlaylistFactory from "../class/playlist-factory";

interface IPlaylistContext {
    tracks: ITrack[]
    currentTrack: ITrack | null
    player: Player | null,
    mode: Mode,
    playlistFactory: PlaylistFactory | null,
    playlists: Playlist[];
    setPlaylists: Dispatch<SetStateAction<Playlist[]>>
}

export const PlaylistContext = createContext<IPlaylistContext>({
    tracks: [],
    currentTrack: null,
    player: null,
    mode: Mode.NORMAL,
    playlistFactory: null,
    playlists: [],
    setPlaylists: () => {}
});

const PlaylistProvider: FC = ({children}) => {
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
    const [mode, setMode] = useState<Mode>(Mode.NORMAL);
    const [player, setPlayer] = useState<Player | null>(null);
    const playlistFactory = new PlaylistFactory(setTracks);

    useEffect(() => {
        const queue = new TrackQueue(setMode);
        setPlayer(new Player(queue, setCurrentTrack));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PlaylistContext.Provider
            value={{
                tracks,
                currentTrack,
                player,
                mode,
                playlistFactory,
                playlists,
                setPlaylists
            }}
        >{children}</PlaylistContext.Provider>
    );
};

export default PlaylistProvider;

