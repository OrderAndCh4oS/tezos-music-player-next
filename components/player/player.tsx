import {FC} from "react";
import {Mode} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import styles from './styles.module.css'
import PrevIcon from '../icons/prev-icon';
import NextIcon from "../icons/next-icon";
import PlayIcon from "../icons/play-icon";
import ShuffleIcon from "../icons/shuffle-icon";
import PauseIcon from "../icons/pause-icon";

interface IPlayer {
}

const Player: FC<IPlayer> = ({...rest}) => {
    const {player, mode, isPlaying, currentTrack} = usePlaylist();

    const handlePlayPause = () => {
        if (isPlaying) {
            player?.pause();
        } else {
            player?.play();
        }
    };

    const handleToggleShuffle = () => {
        player?.queue.toggleShuffle()
    };

    const handlePrevious = () => {
        player?.previous();
    };

    const handleNext = () => {
        player?.next();
    };

    return (
        <div className={styles.player}>
            <p>{currentTrack?.title}</p>
            <p>{currentTrack?.creators.map(c => c.alias || c.address).join(', ')}</p>
            <button
                onClick={handlePlayPause}
                className={styles.controlButton}
            >
                {!isPlaying ? <PlayIcon/> : <PauseIcon/>}
            </button>
            <button
                onClick={handlePrevious}
                className={styles.controlButton}
            >
                <PrevIcon/>
            </button>
            <button
                onClick={handleNext}
                className={styles.controlButton}
            >
                <NextIcon/>
            </button>
            <button
                onClick={handleToggleShuffle}
                className={[styles.controlButton, mode === Mode.SHUFFLE ? styles.active : ''].join(' ')}
            >
                <ShuffleIcon/>
            </button>
        </div>
    );
};

export default Player;
