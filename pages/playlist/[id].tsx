import TrackMeta from "../../components/track-meta/track-meta";
import {GetServerSideProps, NextPage} from "next";
import usePlaylist from "../../hooks/use-playlist";
import SidebarWrapper from "../../components/sidebar-wrapper/sidebar-wrapper";
import TrackRowButton from "../../components/track-row-button/track-row-button";
import styles from "../../components/track-list/styles.module.css";
import PlayIcon from "../../components/icons/play-icon";
import TrackRow from "../../components/track-row/track-row";
import {IToken} from "../../api/get-tracks";
import tokenToTrackTransformer from "../../utilities/token-to-track-transformer";
import {ITrack} from "../../class/playlist";

export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {id} = params;
    return {
        props: {id},
    };
};

const Playlist: NextPage<{ id: string }> = ({id}) => {
    const {playlists, player} = usePlaylist();
    const playlist = playlists.find(p => p.id === id) || null;

    const playNow = (track: ITrack) => () => {
        player!.queue.unshift(track)
        player!.currentTrack = track;
        player!.play();
    };

    const removeFromPlaylist = (track: ITrack) => () => {
       playlist!.remove(track);
    };

    return (
        <SidebarWrapper>
            <h2>{playlist?.title || 'Not found'}</h2>
            {playlist?.tracks.map(t => (
                <TrackRow key={t.id}>
                    <TrackRowButton onClick={playNow(t)} className={styles.controlButton}><PlayIcon/></TrackRowButton>
                    <TrackRowButton onClick={removeFromPlaylist(t)}>-</TrackRowButton>
                    <TrackMeta key={t.id}>
                        <strong>{t.title}</strong>
                        <br/>by {t.creators.map(c => c.alias || c.address)}
                    </TrackMeta>
                </TrackRow>
            ))}
        </SidebarWrapper>
    )
}

export default Playlist;
