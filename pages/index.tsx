import type {NextPage} from 'next'
import {SWRConfig} from 'swr';
import getAudioTokens, {IToken} from "../api/get-tracks";
import TrackListComp from "../components/track-list";
import PlaylistComp from "../components/playlist";
import usePlaylist from "../hooks/use-playlist";
import {Mode} from "../class/playlist";
import {inspect} from "util";
import styles from './styles.module.css'

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
    fallback: { '/api/tracks': IToken[] },
    swrKey: string
}

const Home: NextPage<IHomeProps> = ({fallback, swrKey}) => {

    const {player, mode} = usePlaylist();

    const handlePlayPause = () => {
        player!.play();
    };

    const handleToggleShuffle = () => {
        player?.playlist.toggleShuffle()
    };

    return (
        <SWRConfig
            value={{
                fallback,
                refreshInterval: 1000 * 60 * 15
            }}
        >
            <TrackListComp swrKey={swrKey}/>
            <PlaylistComp/>
            <button onClick={handlePlayPause}>Play</button>
            <button onClick={handleToggleShuffle} className={mode === Mode.SHUFFLE ? styles.active : ''}>Shuffle</button>
        </SWRConfig>
    )
}

export default Home
