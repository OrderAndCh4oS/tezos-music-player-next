import TrackMeta from "../../components/track-meta/track-meta";
import {GetServerSideProps, NextPage} from "next";
import usePlaylist from "../../hooks/use-playlist";
import SidebarWrapper from "../../components/sidebar-wrapper/sidebar-wrapper";
import TrackRowButton from "../../components/track-row-button/track-row-button";
import PlayIcon from "../../components/icons/play-icon";
import TrackRow from "../../components/track-row/track-row";
import {ITrack} from "../../class/playlist";
import TrackLink from "../../components/track-link/track-link";
import styles from './styles.module.css';
import PauseIcon from "../../components/icons/pause-icon";

export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {id} = params;
    return {
        props: {id},
    };
};

const Playlist: NextPage<{ id: string }> = ({id}) => {
    const {playlists, player, currentTrack, isPlaying} = usePlaylist();
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

    return (
        <SidebarWrapper>
            <h2>{playlist?.title || 'Not found'}</h2>
            {playlist?.tracks.map(t => (
                <TrackRow className={isCurrentTrack(t) ? styles.rowPlaying : ''}>
                    <TrackRowButton onClick={togglePlay(t)} className={styles.controlButton}>
                        {isCurrentTrack(t) && isPlaying
                            ? <PauseIcon/>
                            : <PlayIcon/>}
                    </TrackRowButton>
                    <TrackRowButton onClick={removeFromPlaylist(t)}>-</TrackRowButton>
                    <TrackMeta key={t.id}>
                        <strong>{t.title}</strong>
                        <br/>by {t.creators.map(c => c.alias || c.address)}
                    </TrackMeta>
                    <TrackLink track={t}/>
                </TrackRow>
            ))}
        </SidebarWrapper>
    )
}

export default Playlist;
