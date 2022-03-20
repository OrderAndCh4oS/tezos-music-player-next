import {FC, HTMLAttributes} from "react";
import CreatePlaylistComp from "../create-playlist/create-playlist";
import PlaylistsComp from "../playlists/playlists";
import Player from "../player/player";
import Link from "next/link";
import styles from './styles.module.css'

const SidebarWrapper: FC<HTMLAttributes<HTMLParagraphElement>> = ({children, ...rest}) =>
    <div className={styles.sidebarWrapper} {...rest}>
        <div className={styles.sidebar}>
            <div>
                <Link href={'/'}>
                    <a className={styles.link}>All Tracks</a>
                </Link>
                <Link href={'/queue'}>
                    <a className={styles.link}>Queue</a>
                </Link>
            </div>
            <CreatePlaylistComp/>
            <PlaylistsComp/>
        </div>
        <div>
            {children}
        </div>
        <Player/>
    </div>
;

export default SidebarWrapper;
