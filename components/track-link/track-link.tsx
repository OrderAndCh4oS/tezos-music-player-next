import {FC} from "react";
import {ITrack} from "../../class/playlist";
import styles from "./styles.module.css";
import ExternalLinkIcon from "../icons/external-link-icon";


const TrackLink: FC<{ track: ITrack }> = ({track}) =>
    <a
        href={`https://objkt.com/asset/${track.contract}/${track.token_id}`}
        className={styles.trackLink}
        target='_blank'
        rel="noreferrer"
    >
        <span className={styles.text}>
            View on Objkt
        </span>
        <span className={styles.icon}>
            <ExternalLinkIcon title={'View on Objkt'}/>
        </span>
    </a>
;

export default TrackLink;
