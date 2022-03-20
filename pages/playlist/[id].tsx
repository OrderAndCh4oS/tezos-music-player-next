import TrackMeta from "../../components/track-meta/track-meta";
import {GetServerSideProps, NextPage} from "next";
import usePlaylist from "../../hooks/use-playlist";
import SidebarWrapper from "../../components/sidebar-wrapper/sidebar-wrapper";

export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {id} = params;
    return {
        props: {id},
    };
};

const Playlist: NextPage<{ id: string }> = ({id}) => {
    const {playlists} = usePlaylist();
    const playlist = playlists.find(p => p.id === id) || null;
    return (
        <SidebarWrapper>
            <h2>{playlist?.title || 'Not found'}</h2>
            {playlist?.tracks.map(t => (
                <TrackMeta key={t.id}>
                    <strong>{t.title}</strong>
                    <br/>by {t.creators.map(c => c.alias || c.address)}
                </TrackMeta>
            ))}
        </SidebarWrapper>
    )
}

export default Playlist;
