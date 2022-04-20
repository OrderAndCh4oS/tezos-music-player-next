import {FC} from "react";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";
import styles from './styles.module.css'
import PlayIcon from "../icons/play-icon";
import AddTrackButton from "../add-track-button/add-track-button";
import TrackLink from "../track-link/track-link";
import PauseIcon from "../icons/pause-icon";
import Button from "../button/button";
import ControlButton from "../control-button/control-button";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";
import CreatorsLinks from "../creators-links/creators-links";

interface IPlaylistProps {
}

const QueueComp: FC<IPlaylistProps> = () => {
    const {player, queuedTracks, cursor, isPlaying} = usePlaylist();

    const removeFromPlaylist = (index: number) => () => {
        player!.queue.removeAtIndex(index);
    };

    const clearQueue = () => {
        player!.queue.removeAllTracks()
    }

    const togglePlay = (index: number) => () => {
        if (isPlaying && isCurrentTrack(index)) {
            player!.pause();
            return;
        }
        player!.queue.goToCursor(index);
        player!.play();

    };

    const isCurrentTrack = (i: number) => cursor === i;

    return (
        <>
            <div className={styles.topBar}>
                <Button onClick={clearQueue}>Clear Queue</Button>
            </div>
            {queuedTracks?.length ? queuedTracks?.map((t, i) => (
                <TrackRow key={t.id + i} className={isCurrentTrack(i) ? styles.rowPlaying : ''}>
                    <ControlButton
                        onClick={togglePlay(i)}
                        className={styles.controlSpacer}
                    >
                        {isCurrentTrack(i) && isPlaying
                            ? <PauseIcon/>
                            : <PlayIcon/>
                        }
                    </ControlButton>
                    <AddTrackButton track={t}>+</AddTrackButton>
                    <TrackRowButton onClick={removeFromPlaylist(i)}>-</TrackRowButton>
                    <TrackMeta>
                        <strong>{t.title}</strong>
                        <br/>by <CreatorsLinks track={t}/>
                    </TrackMeta>
                    <TrackLink track={t}/>
                </TrackRow>
            )) : <p>No queued tracks</p>}
        </>
    )
};

export default QueueComp;
