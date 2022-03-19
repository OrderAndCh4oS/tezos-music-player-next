import type {GetServerSideProps, NextPage} from 'next'
import {SWRConfig} from 'swr';
import getAudioTokensFetcher, {audioTokensApi, IToken} from "../../api/get-tracks";
import TrackListComp from "../../components/track-list/track-list";
import QueueComp from "../../components/queue/queue";
import CreatePlaylistComp from "../../components/create-playlist/create-playlist";
import PlaylistsComp from "../../components/playlists/playlists";
import Player from "../../components/player/player";


export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {page} = params;
    const data = await getAudioTokensFetcher(audioTokensApi, Number(page), 250);
    const swrKey = JSON.stringify([audioTokensApi, Number(page), 250]);
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
            <CreatePlaylistComp/>
            <PlaylistsComp/>
            <TrackListComp swrKey={swrKey}/>
            <QueueComp/>
            <Player/>
        </SWRConfig>
    )
}

export default HomePaged
