import {FC} from "react";
import Playlist, {ITrack} from "../class/playlist";
import usePlaylist from "../hooks/use-playlist";

interface IPlaylistProps {
}

const PlaylistComp: FC<IPlaylistProps> = () => {

    const {player, tracks} = usePlaylist();

    const removeFromPlaylist = (track: ITrack) => () => {
        player!.playlist.remove(track);
    };

    return (
        <div>
            <h2>Playlist</h2>
            {tracks?.map(t => <button
                key={t.id}
                onClick={removeFromPlaylist(t)}
            >{t.title}</button>)}
        </div>
    )
};

export default PlaylistComp;
