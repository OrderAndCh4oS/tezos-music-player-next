import getAudioTokensFetcher from "../../api/get-tracks";
import {FC, useEffect, useState} from "react";
import useSWR from "swr";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";
import tokenToTrackTransformer from "../../utilities/token-to-track-transformer";
import AddTrackButton from "../add-track-button/add-track-button";
import serialise from "../../utilities/serialise";
import NextPrev from "../next-prev";
import PlayIcon from "../icons/play-icon";
import styles from './styles.module.css'
import {ITrack} from "../../class/playlist";
import TrackLink from "../track-link/track-link";
import PauseIcon from "../icons/pause-icon";
import Button from "../button/button";

interface ITrackListProps {
    swrKey: string
}

const TrackListComp: FC<ITrackListProps> = ({swrKey}) => {
    const {data} = useSWR(swrKey, getAudioTokensFetcher, {use: [serialise]});
    const {player, isPlaying, currentTrack} = usePlaylist();
    const [tracks, setTracks] = useState<ITrack[]>([]);

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
        setTracks(data?.tokens?.map(t => tokenToTrackTransformer(t)) || [])
    }, [data]);


    const queueAll = () => {
        player!.queue.tracks = tracks;
        player!.play();
    };

    return (
        <div>
            <h2>Track List</h2>
            <div className={styles.topBar}>
                <Button onClick={queueAll}>Play All</Button>
            </div>
            {tracks.map(t => (
                <TrackRow key={t.token_id + '_' + t.contract} className={isCurrentTrack(t) ? styles.rowPlaying : ''}>
                    <TrackRowButton onClick={togglePlay(t)} className={styles.controlButton}>
                        {isCurrentTrack(t) && isPlaying
                            ? <PauseIcon/>
                            : <PlayIcon/>}
                    </TrackRowButton>
                    <AddTrackButton track={t}>+</AddTrackButton>
                    <TrackMeta>
                        <strong>{t.title}</strong>
                        <br/>by {t.creators.map(c => c.alias || c.address)}
                    </TrackMeta>
                    <TrackLink track={t}/>
                </TrackRow>
            ))}
            <NextPrev swrKey={swrKey}/>
        </div>
    )
};

export default TrackListComp;
