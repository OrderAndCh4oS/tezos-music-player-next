import {FC} from "react";
import Playlist, {ITrack} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackMeta from "../track-meta/track-meta";
import PlayIcon from "../icons/play-icon";
import styles from './styles.module.css'
import ControlButton from "../control-button/control-button";
import useSWR from "swr";
import serialise from "../../utilities/serialise";
import PauseIcon from "../icons/pause-icon";
import AddTrackButton from "../add-track-button/add-track-button";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";
import TrackLinks from "../track-link/track-links";
import getPlaylistByIdFetcher from "../../api/get-playlist-by-id";
import CreatorsLinks from "../creators-links/creators-links";
import Link from "next/link";
import useToast from '../../hooks/use-toast';

interface IPlaylistDetailProps {
    swrKey: string
}

const PlaylistDetailComp: FC<IPlaylistDetailProps> = ({swrKey}) => {
    const {setMessage} = useToast();
    const {data} = useSWR(swrKey, getPlaylistByIdFetcher, {use: [serialise]});
    const playlist = data?.playlist ? data.playlist : null;
    const {player, currentTrack, isPlaying} = usePlaylist();

    const handleAddToQueue = (playlist: Playlist) => () => {
        try{
            player?.queue.queuePlaylist(playlist);
            player?.restart();
        } catch (e) {
            setMessage('Could not start queue')
            console.log(e);
        }
    };

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

    const queueAll = (tracks: ITrack[]) => {
        player!.queue.tracks = tracks;
        player!.play();
    };

    if (!playlist) return (
        <div>
            <h2>Playlist</h2>
            <p>Not found</p>
        </div>
    )

    return (
        <div>
            <h2>Playlist</h2>
            <div>
                <TrackRow>
                    <ControlButton
                        onClick={handleAddToQueue(playlist)}
                        className={styles.controlSpacer}
                    >
                        <PlayIcon title={`Play ${playlist.title}`}/>
                    </ControlButton>
                    <TrackMeta>
                        <strong>{playlist.title}</strong>
                        <p className={styles.address}>Created by{' '}
                            <a
                                href={`https://objkt.com/profile/${playlist.creatorAddress}/created`}
                                target='_blank'
                                rel="noreferrer"
                            >
                                {getTrimmedWallet(playlist.creatorAddress)}
                            </a>
                        </p>
                    </TrackMeta>
                </TrackRow>
                {playlist.tracks.map((t: ITrack) => (
                    <TrackRow
                        key={t.token_id + '_' + t.contract}
                        className={[isCurrentTrack(t) ? styles.rowPlaying : '', styles.innerRow].join(' ')}
                    >
                        <ControlButton
                            onClick={togglePlay(t)}
                            className={styles.controlSpacer}
                        >
                            {isCurrentTrack(t) && isPlaying
                                ? <PauseIcon/>
                                : <PlayIcon title={`Play ${t.title}`}/>}
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
            </div>
        </div>
    )
};

export default PlaylistDetailComp;
