import type {GetServerSideProps, NextPage} from 'next'
import {SWRConfig} from 'swr';
import getAudioTokensFetcher, {audioTokensApi, IToken} from "../../api/get-tracks";
import TrackListComp from "../../components/track-list/track-list";
import QueueComp from "../../components/queue/queue";
import usePlaylist from "../../hooks/use-playlist";
import {Mode} from "../../class/playlist";
import styles from './styles.module.css'
import CreatePlaylistComp from "../../components/create-playlist/create-playlist";
import PlaylistsComp from "../../components/playlists/playlists";


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

    const {player, mode, currentTrack} = usePlaylist();

    const handlePlayPause = () => {
        player?.play();
    };

    const handleToggleShuffle = () => {
        player?.queue.toggleShuffle()
    };

    const handlePrevious = () => {
        player?.previous();
    };

    const handleNext = () => {
        player?.next();
    };

    return (
        <SWRConfig
            value={{
                fallback,
                refreshInterval: 1000 * 60 * 15
            }}
        >
            <CreatePlaylistComp/>
            <PlaylistsComp/>
            <hr/>
            <TrackListComp swrKey={swrKey}/>
            <hr/>
            <QueueComp/>
            <hr/>
            <h2>Now Playing</h2>
            <p>{currentTrack?.title}</p>
            <p>{currentTrack?.creators.map(c => c.alias || c.address).join(', ')}</p>
            <button onClick={handlePlayPause}>Play</button>
            <button
                onClick={handlePrevious}
            >{'|<'}
            </button>
            <button
                onClick={handleNext}
            >{'>|'}
            </button>
            <button
                onClick={handleToggleShuffle}
                className={mode === Mode.SHUFFLE ? styles.active : ''}
            >Shuffle
            </button>
        </SWRConfig>
    )
}

export default HomePaged
