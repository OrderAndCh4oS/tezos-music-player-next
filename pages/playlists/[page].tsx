import type {GetServerSideProps, NextPage} from 'next'
import {SWRConfig} from 'swr';
import {IToken} from "../../api/get-tracks";
import SidebarWrapper from "../../components/sidebar-wrapper/sidebar-wrapper";
import getAllPlaylistsFetcher, {allPlaylistsLimit, playlistsApi} from "../../api/get-all-playlists";
import AllPlaylistsComp from "../../components/all-playlists/all-playlists";

export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {page} = params;
    const data = await getAllPlaylistsFetcher(playlistsApi, Number(page), allPlaylistsLimit);
    const swrKey = JSON.stringify([playlistsApi, Number(page), allPlaylistsLimit]);
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
                <AllPlaylistsComp swrKey={swrKey}/>
            </SidebarWrapper>
        </SWRConfig>
    )
}

export default HomePaged
