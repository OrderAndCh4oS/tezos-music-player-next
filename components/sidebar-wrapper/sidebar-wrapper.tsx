import {FC, HTMLAttributes} from "react";
import CreatePlaylistComp from "../create-playlist/create-playlist";
import PlaylistsComp from "../playlists/playlists";
import Player from "../player/player";
import styles from './styles.module.css'

const SidebarWrapper: FC<HTMLAttributes<HTMLParagraphElement>> = ({children, ...rest}) =>
    <div className={styles.sidebarWrapper} {...rest}>
        <div className={styles.sidebar}>
            <CreatePlaylistComp/>
            <PlaylistsComp/>
        </div>
        <div className={styles.mainContent}>
            {children}
        </div>
        <Player/>
    </div>
;

export default SidebarWrapper;
