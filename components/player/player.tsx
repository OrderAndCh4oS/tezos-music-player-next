import {FC} from "react";
import {Mode} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import styles from './styles.module.css'
import PrevIcon from '../icons/prev-icon';
import NextIcon from "../icons/next-icon";
import PlayIcon from "../icons/play-icon";
import ShuffleIcon from "../icons/shuffle-icon";
import PauseIcon from "../icons/pause-icon";
import DarkModeButton from "../dark-mode-button/dark-mode-button";
import ControlButton from "../control-button/control-button";
import TrackLink from "../track-link/track-link";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";

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
            <div className={styles.controls}>
                <ControlButton
                    onClick={handlePlayPause}
                >
                    {!isPlaying ? <PlayIcon/> : <PauseIcon/>}
                </ControlButton>
                <ControlButton
                    onClick={handlePrevious}
                >
                    <PrevIcon/>
                </ControlButton>
                <ControlButton
                    onClick={handleNext}
                >
                    <NextIcon/>
                </ControlButton>
                <ControlButton
                    onClick={handleToggleShuffle}
                    className={mode === Mode.SHUFFLE ? styles.active : ''}
                >
                    <ShuffleIcon/>
                </ControlButton>
            </div>
            <div className={styles.metadata}>
                {currentTrack ? <>
                        <div>
                            <h2 className={styles.title}>{currentTrack?.title}</h2>
                            <p className={styles.artists}>{currentTrack?.creators.map(c => c.alias || getTrimmedWallet(c.address)).join(', ')}</p>
                        </div>
                        <TrackLink track={currentTrack}/>
                    </>
                    : <div>
                        <h2 className={styles.title}>No track</h2>
                    </div>}
            </div>
            <DarkModeButton/>
        </div>
    );
};

export default Player;
