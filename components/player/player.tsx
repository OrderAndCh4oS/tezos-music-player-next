import {FC} from "react";
import {Mode} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import styles from './styles.module.css'

interface IPlayer {
}

const Player: FC<IPlayer> = ({...rest}) => {
    const {player, mode, currentTrack} = usePlaylist();

    const handlePlayPause = () => {
        player?.play();
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
            <h2>Now Playing</h2>
            <p>{currentTrack?.title}</p>
            <p>{currentTrack?.creators.map(c => c.alias || c.address).join(', ')}</p>
            <button onClick={handlePlayPause}>Play</button>
            <button
                onClick={handlePrevious}
            >{'|<'}
            </button>
            <button
                onClick={handleNext}
            >{'>|'}
            </button>
            <button
                onClick={handleToggleShuffle}
                className={mode === Mode.SHUFFLE ? styles.active : ''}
            >Shuffle
            </button>
        </div>
    );
};

export default Player;
