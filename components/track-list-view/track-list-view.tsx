import getAudioTokensFetcher, {audioTokensLimit} from "../../api/get-tracks";
import {FC, KeyboardEvent, useEffect, useState} from "react";
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
import TrackLinks from "../track-link/track-links";
import PauseIcon from "../icons/pause-icon";
import Button from "../button/button";
import ControlButton from "../control-button/control-button";
import SearchBar from "../search-bar/search-bar";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";
import getAllPlaylistsFetcher from "../../api/get-all-playlists";
import CreatorsLinks from "../creators-links/creators-links";
import Link from "next/link";

interface ITrackListProps {
    swrKey: string
}

const TrackListView: FC<ITrackListProps> = ({swrKey}) => {
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
                <SearchBar/>
            </div>
            {tracks.map(t => (
                <TrackRow key={t.token_id + '_' + t.contract} className={isCurrentTrack(t) ? styles.rowPlaying : ''}>
                    <ControlButton
                        onClick={togglePlay(t)}
                        className={styles.controlSpacer}
                    >
                        {isCurrentTrack(t) && isPlaying
                            ? <PauseIcon/>
                            : <PlayIcon/>}
                    </ControlButton>
                    <AddTrackButton track={t}>+</AddTrackButton>
                    <TrackMeta>
                        <Link href={`/track/${t.contract}/${t.token_id}`}>
                            <a>
                                <strong>{t.title}</strong>
                            </a>
                        </Link>
                        <br/>by <CreatorsLinks track={t}/>
                    </TrackMeta>
                    <TrackLinks track={t}/>
                </TrackRow>
            ))}
            <NextPrev path={'/page'} swrKey={swrKey} fetcher={getAudioTokensFetcher} mightHaveMore={tracks.length === audioTokensLimit}/>
        </div>
    )
};

export default TrackListView;
