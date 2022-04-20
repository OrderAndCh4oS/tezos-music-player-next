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
import getAllPlaylistsFetcher from "../../api/get-all-playlists";
import PauseIcon from "../icons/pause-icon";
import AddTrackButton from "../add-track-button/add-track-button";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";
import TrackLink from "../track-link/track-link";

interface IAllPlaylistProps {
    swrKey: string
}

const AllPlaylistsComp: FC<IAllPlaylistProps> = ({swrKey}) => {
    const {data} = useSWR(swrKey, getAllPlaylistsFetcher, {use: [serialise]});
    const playlists = data?.map(d => d.data) || [];
    const {player, currentTrack, isPlaying} = usePlaylist();

    const handleAddToQueue = (playlist: Playlist) => () => {
        player?.queue.queuePlaylist(playlist);
        player?.restart();
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

    return (
        <div>
            <h2>Playlists</h2>
            {!playlists.length && 'No playlists'}
            {playlists.map(p => (
                <div key={p.id}>
                    <TrackRow>
                        <ControlButton
                            onClick={handleAddToQueue(p)}
                            className={styles.controlSpacer}
                        >
                            <PlayIcon/>
                        </ControlButton>
                        <TrackMeta>
                            <strong>{p.title}</strong>
                            <p className={styles.address}>Created by{' '}
                                <a
                                    href={`https://objkt.com/profile/${p.creatorAddress}/created`}
                                    target='_blank'
                                    rel="noreferrer"
                                >
                                    {getTrimmedWallet(p.creatorAddress)}
                                </a>
                            </p>
                        </TrackMeta>
                    </TrackRow>
                    {p.tracks.map((t: ITrack) => (
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
                                    : <PlayIcon/>}
                            </ControlButton>
                            <AddTrackButton track={t}>+</AddTrackButton>
                            <TrackMeta>
                                <strong>{t.title}</strong>
                                <br/>by {t.creators.map(c => c.alias || getTrimmedWallet(c.address))}
                            </TrackMeta>
                            <TrackLink track={t}/>
                        </TrackRow>
                    ))}
                </div>
            ))}
        </div>
    )
};

export default AllPlaylistsComp;
