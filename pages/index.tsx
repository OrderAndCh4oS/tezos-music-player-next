import type {NextPage} from 'next'
import {SWRConfig} from 'swr';
import Player from "../class/player";
import getAudioTokens, {IToken} from "../api/get-tracks";
import TrackList from "../components/track-list";

const swrKey = '/api/tracks';

export const getStaticProps = async () => {
    const data = await getAudioTokens();

    return {
        props: {
            swrKey,
            fallback: {
                [swrKey]: data
            }
        },
        revalidate: 60 * 15
    };
};

interface IHomeProps {
    player: Player,
    fallback: { '/api/tracks': IToken[] },
    swrKey: string
}

const Home: NextPage<IHomeProps> = ({player, fallback, swrKey}) => {

    const handlePlayPause = () => {
        player.play();
    };

    return (
        <SWRConfig
            value={{
                fallback,
                refreshInterval: 1000 * 60 * 15
            }}
        >
            <TrackList swrKey={swrKey} player={player}/>
            <button onClick={handlePlayPause}>Play</button>
        </SWRConfig>
    )
}

export default Home
