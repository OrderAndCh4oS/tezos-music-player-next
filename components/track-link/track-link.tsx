import {FC} from "react";
import {ITrack} from "../../class/playlist";
import styles from "./styles.module.css";


const TrackLink: FC<{ track: ITrack }> = ({track}) =>
    <a
        href={`https://objkt.com/asset/${track.contract}/${track.token_id}`}
        className={styles.trackLink}
        target='_blank'
        rel="noreferrer"
    >View on Objkt</a>
;

export default TrackLink;
