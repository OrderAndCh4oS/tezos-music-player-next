import getAudioTokensFetcher, {IToken} from "../../api/get-tracks";
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

interface ITrackListProps {
    swrKey: string
}

const TrackListComp: FC<ITrackListProps> = ({swrKey}) => {
    const {data} = useSWR(swrKey, getAudioTokensFetcher, {use: [serialise]});
    const {player} = usePlaylist();
    const [tracks, setTracks] = useState<ITrack[]>([]);

    const playNow = (track: ITrack) => () => {
        player?.queue.insert(track);
        player?.queue.incrementCursor();
        player!.play();
    };

    useEffect(() => {
        setTracks(data?.tokens?.map(t => tokenToTrackTransformer(t)) || [])
    }, [data]);

    return (
        <div>
            <h2>Track List</h2>
            {tracks.map(t => (
                <TrackRow key={t.token_id + '_' + t.contract}>
                    <TrackRowButton onClick={playNow(t)} className={styles.controlButton}><PlayIcon/></TrackRowButton>
                    <AddTrackButton track={t}>+</AddTrackButton>
                    <TrackMeta>
                        <strong>{t.title}</strong>
                        <br/>by {t.creators.map(c => c.alias || c.address)}
                    </TrackMeta>
                </TrackRow>
            ))}
            <NextPrev swrKey={swrKey}/>
        </div>
    )
};

export default TrackListComp;
