import {FC, useEffect, useState} from "react";
import {ITrack} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import useSWR from "swr";
import serialise from "../../utilities/serialise";
import getTrackFetcher from "../../api/get-track";
import TrackLinks from "../track-link/track-links";
import ControlButton from "../control-button/control-button";
import styles from "./styles.module.css";
import PlayIcon from "../icons/play-icon";
import TrackMeta from "../track-meta/track-meta";
import Link from "next/link";
import PauseIcon from "../icons/pause-icon";
import AddTrackButton from "../add-track-button/add-track-button";
import CreatorsLinks from "../creators-links/creators-links";
import tokenToTrackTransformer from "../../utilities/token-to-track-transformer";
import mutezToTez from "../../utilities/mutez-to-tez";
import {getIpfsUrl} from '../../utilities/get-ipfs-url';

interface IPlaylistDetailProps {
    swrKey: string
}

const PlaylistDetailView: FC<IPlaylistDetailProps> = ({swrKey}) => {
    const {data} = useSWR(swrKey, getTrackFetcher, {use: [serialise]});
    const token = data?.token ? data.token : null;
    const {player, currentTrack, isPlaying} = usePlaylist();

    const [track, setTrack] = useState<ITrack | null>(null);

    const isCurrentTrack = (t: ITrack) =>
        currentTrack?.token_id === t.token_id && currentTrack.contract === t.contract;

    const togglePlay = (track: ITrack) => () => {
        if (isPlaying && isCurrentTrack(track)) {
            player!.pause();
            return;
        }
        player?.queue.insert(track);
        player?.queue.incrementCursor();
        player!.play();
    };

    useEffect(() => {
        if (!token) return;
        setTrack(tokenToTrackTransformer(token))
    }, [data]);

    if (!(token && track)) return (
        <div>
            <h2>Track</h2>
            <p>Not found</p>
        </div>
    )

    return (
        <div>
            <h2>Track</h2>
            {token.display_uri && <img src={getIpfsUrl(token.display_uri)} className={styles.image}/>}
            <div className={styles.controlsHolder}>
                <ControlButton
                    onClick={togglePlay(track)}
                    className={styles.controlSpacer}
                >
                    {isCurrentTrack(track) && isPlaying
                        ? <PauseIcon/>
                        : <PlayIcon/>}
                </ControlButton>
                <AddTrackButton track={track}>+</AddTrackButton>
            </div>
            <TrackMeta>
                <Link href={`/track/${track.contract}/${track.token_id}`}>
                    <a>
                        <strong>{track.title}</strong>
                    </a>
                </Link>
                <br/>by <CreatorsLinks track={track}/>
            </TrackMeta>
            <p className={styles.text}>{token.description}</p>
            {token.lowest_ask > 0 &&
                <p className={styles.text}>Available for: {mutezToTez(token.lowest_ask)}ꜩ</p>}
            {token.highest_offer && <p className={styles.text}>Highest offer: {mutezToTez(token.highest_offer)}ꜩ</p>}
            <TrackLinks track={track}/>
        </div>
    )
};

export default PlaylistDetailView;
