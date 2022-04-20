import type {GetServerSideProps, NextPage} from 'next'
import {SWRConfig} from 'swr';
import {playlistsApi} from "../../../api/get-all-playlists";
import {IToken} from "../../../api/get-tracks";
import SidebarWrapper from "../../../components/sidebar-wrapper/sidebar-wrapper";
import getPlaylistByIdFetcher from "../../../api/get-playlist-by-id";
import PlaylistDetailComp from "../../../components/playlist-detail/playlist-detail";

export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {id} = params;
    const data = await getPlaylistByIdFetcher(playlistsApi, id);
    const swrKey = JSON.stringify([playlistsApi, id]);
    return {
        props: {
            swrKey,
            fallback: {
                [swrKey]: data
            }
        },
    };
};

interface IHomeProps {
    fallback: { [swrKey: string]: IToken[] },
    swrKey: string
}

const HomePaged: NextPage<IHomeProps> = ({swrKey, fallback}) => {
    return (
        <SWRConfig
            value={{
                fallback,
                refreshInterval: 1000 * 60 * 15
            }}
        >
            <SidebarWrapper>
                <PlaylistDetailComp swrKey={swrKey}/>
            </SidebarWrapper>
        </SWRConfig>
    )
}

export default HomePaged
