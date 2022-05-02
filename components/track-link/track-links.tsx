import {FC} from "react";
import {ITrack} from "../../class/playlist";
import styles from "./styles.module.css";
import ExternalLinkIcon from "../icons/external-link-icon";

const hicEtNuncMintContract = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'

const TrackLinks: FC<{ track: ITrack }> = ({track}) =>
    <div className={styles.trackLinkHolder}>
        {track.contract === hicEtNuncMintContract
            ? (
                <a
                    href={`https://teia.art/objkt/${track.token_id}`}
                    className={styles.trackLink}
                    target='_blank'
                    rel="noreferrer"
                >
                    <span className={styles.text}>
                        View on Teia
                    </span>
                    <span className={styles.icon}>
                        <ExternalLinkIcon title={'View on Teia'}/>
                    </span>
                </a>
            ) : null}
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
    </div>

;

export default TrackLinks;
