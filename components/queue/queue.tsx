import {FC} from "react";
import {ITrack} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";
import styles from './styles.module.css'
import PlayIcon from "../icons/play-icon";
import AddTrackButton from "../add-track-button/add-track-button";

interface IPlaylistProps {
}

const QueueComp: FC<IPlaylistProps> = () => {
    const {player, queuedTracks, cursor} = usePlaylist();

    const removeFromPlaylist = (track: ITrack) => () => {
        player!.queue.remove(track);
    };

    const clearQueue = () => {

    }

    const playNow = (index: number) => () => {
        player?.queue.goToCursor(index);
        player!.play();
    };

    return (
        <>
            {queuedTracks?.length ? queuedTracks?.map((t, i) => (
                <TrackRow key={t.id} className={cursor === i ? styles.rowPlaying: ''}>
                    <TrackRowButton onClick={playNow(i)} className={styles.controlButton}><PlayIcon/></TrackRowButton>
                    <AddTrackButton track={t}>+</AddTrackButton>
                    <TrackRowButton onClick={removeFromPlaylist(t)}>-</TrackRowButton>
                    <TrackMeta>
                        <strong>{t.title}</strong>
                        <br/>by {t.creators.map(c => c.alias || c.address)}
                    </TrackMeta>
                </TrackRow>
            )) : <p>No queued tracks</p>}
        </>
    )
};

export default QueueComp;
