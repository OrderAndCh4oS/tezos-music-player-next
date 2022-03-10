import {ButtonHTMLAttributes, Dispatch, FC, HTMLAttributes, SetStateAction, useEffect, useRef, useState} from "react";
import styles from './styles.module.css'
import usePlaylist from "../../hooks/use-playlist";
import TrackRowButton from "../track-row-button/track-row-button";
import Playlist, {ITrack} from "../../class/playlist";

interface IAddTrackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    track: ITrack;
}

interface IAddTrackMenuProps extends HTMLAttributes<HTMLElement> {
    track: ITrack;
    showMenu: boolean,
    setShowMenu: Dispatch<SetStateAction<boolean>>
    holderRef: any
}

const AddTrackMenu: FC<IAddTrackMenuProps> = ({track, showMenu, setShowMenu, holderRef}) => {
    const {player, playlists} = usePlaylist();

    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);

        function handleClick(e: any) {
            if (holderRef && holderRef.current) {
                const ref: any = holderRef.current
                if (!ref.contains(e.target)) {
                    setShowMenu(false);
                }
            }
        }
    }, []);

    const addToQueue = () => {
        player!.queue.push(track);
        setShowMenu(false);
    };

    const addToPlaylist = (playlist: Playlist) => () => {
        playlist.append(track);
        setShowMenu(false);
    };

    return (
        <div
            ref={holderRef as any}
            className={[styles.addTrackMenu, showMenu ? styles.open : ''].join(' ')}
        >
            <button
                className={styles.addTrackMenuButton}
                onClick={addToQueue}
            >Queue
            </button>
            {playlists.map(p => (
                <button
                    key={p.id}
                    className={styles.addTrackMenuButton}
                    onClick={addToPlaylist(p)}
                >{p.title}
                </button>
            ))}
        </div>
    )
}

const AddTrackButton: FC<IAddTrackButtonProps> = ({track, children, ...rest}) => {
    const [showMenu, setShowMenu] = useState(false);
    const holderRef = useRef();

    const handleOpen = () => {
        setShowMenu(true);
    };

    return (
        <div className={styles.addTrackButtonHolder} ref={holderRef as any}>
            <TrackRowButton {...rest} onClick={handleOpen}>
                {children}
            </TrackRowButton>
            <AddTrackMenu
                track={track}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                holderRef={holderRef}
            />
        </div>
    );
};

export default AddTrackButton;
