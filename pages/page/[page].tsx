import type {GetServerSideProps, NextPage} from 'next'
import {SWRConfig} from 'swr';
import getAudioTokensFetcher, {audioTokensApi, IToken} from "../../api/get-tracks";
import TrackListComp from "../../components/track-list/track-list";
import SidebarWrapper from "../../components/sidebar-wrapper/sidebar-wrapper";

export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {page} = params;
    let {search} = query
    if(Array.isArray(search)) {
        search = search[0];
    }
    const data = await getAudioTokensFetcher(audioTokensApi, search, Number(page), 250);
    const swrKey = JSON.stringify([audioTokensApi, search, Number(page), 250]);
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
                <TrackListComp swrKey={swrKey}/>
            </SidebarWrapper>
        </SWRConfig>
    )
}

export default HomePaged
