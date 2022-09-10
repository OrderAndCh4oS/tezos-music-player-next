import TrackMeta from "../../components/track-meta/track-meta";
import {GetServerSideProps, NextPage} from "next";
import usePlaylist from "../../hooks/use-playlist";
import SidebarWrapper from "../../components/sidebar-wrapper/sidebar-wrapper";
import TrackRowButton from "../../components/track-row-button/track-row-button";
import PlayIcon from "../../components/icons/play-icon";
import TrackRow from "../../components/track-row/track-row";
import {ITrack} from "../../class/playlist";
import TrackLinks from "../../components/track-link/track-links";
import styles from './styles.module.css';
import PauseIcon from "../../components/icons/pause-icon";
import Button from "../../components/button/button";
import ControlButton from "../../components/control-button/control-button";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";
import LinkButton from "../../components/link-button/link-button";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {id} = params;
    return {
        props: {id},
    };
};

const PlaylistLocalPage: NextPage<{ id: string }> = ({id}) => {
    const {playlists, player, currentTrack, isPlaying, playlistCollection} = usePlaylist();
    const playlist = playlists.find(p => p.id === id) || null;

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

    const removeFromPlaylist = (track: ITrack) => () => {
        playlist!.remove(track);
    };

    const deletePlaylist = async () => {
        if (!playlist) return;
        playlistCollection!.remove(playlist);
        if (!playlist.collectionId) return;
    }

    const queueAll = () => {
        if (!playlist?.tracks) return;
        player!.queue.tracks = playlist?.tracks;
        player!.play();
    };

    return (
        <SidebarWrapper>
            <h2 className={styles.title}>{playlist?.title || 'Not found'}</h2>
            {playlist?.collectionId && <p className={styles.playlistId}>Playlist #{playlist.collectionId}</p>}
            <div className={styles.topBar}>
                <Button onClick={queueAll} className={styles.buttonSpacer}>Play All</Button>
                <Button onClick={deletePlaylist} className={styles.buttonSpacer}>Delete</Button>
            </div>
            {playlist?.tracks.map(t => (
                <TrackRow key={t.token_id + '_' + t.contract} className={isCurrentTrack(t) ? styles.rowPlaying : ''}>
                    <ControlButton onClick={togglePlay(t)} className={styles.controlSpacer}>
                        {isCurrentTrack(t) && isPlaying
                            ? <PauseIcon/>
                            : <PlayIcon/>}
                    </ControlButton>
                    <TrackRowButton onClick={removeFromPlaylist(t)}>-</TrackRowButton>
                    <TrackMeta key={t.id}>
                        <Link href={`/track/${t.contract}/${t.token_id}`}>
                            <a>
                                <strong>{t.title}</strong>
                            </a>
                        </Link>
                        <br/>by {t.creators.map(c => c.alias || getTrimmedWallet(c.address))}
                    </TrackMeta>
                    <TrackLinks track={t}/>
                </TrackRow>
            ))}
        </SidebarWrapper>
    )
}

export default PlaylistLocalPage;
