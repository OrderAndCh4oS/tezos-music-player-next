import {createContext, FC, useEffect, useState} from 'react';
import Playlist, {ITrack, Mode} from "../class/playlist";
import Player from "../class/player";

interface IPlaylistContext {
    tracks: ITrack[]
    currentTrack: ITrack | null
    player: Player | null,
    mode: Mode
}

export const PlaylistContext = createContext<IPlaylistContext>({
    tracks: [],
    currentTrack: null,
    player: null,
    mode: Mode.NORMAL
});

const PlaylistProvider: FC = ({children}) => {
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
    const [mode, setMode] = useState<Mode>(Mode.NORMAL);
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const playlist = new Playlist(setTracks, setCurrentTrack, setMode);
        setPlayer(new Player(playlist));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PlaylistContext.Provider
            value={{
                tracks,
                currentTrack,
                player,
                mode
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
};

export default PlaylistProvider;

