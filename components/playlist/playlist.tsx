import {FC} from "react";
import {ITrack} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import styles from './styles.module.css'
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";

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
            {tracks?.map(t => (
                <TrackRow key={t.id}>
                    <TrackRowButton onClick={removeFromPlaylist(t)}>-</TrackRowButton>
                    <TrackMeta>
                        <strong>{t.title}</strong>
                        <br/>by {t.creators.map(c => c.alias || c.address)}
                    </TrackMeta>
                </TrackRow>
            ))}
        </div>
    )
};

export default PlaylistComp;
