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
import Button from "../../components/button/button";
import useTools from "../../hooks/use-tools";
import {create, IPFSHTTPClient} from "ipfs-http-client";
import ControlButton from "../../components/control-button/control-button";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";
import LinkButton from "../../components/link-button/link-button";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async ({params, query}) => {
    // @ts-ignore
    const {id} = params;
    return {
        props: {id},
    };
};

let ipfs: IPFSHTTPClient;

if (typeof window !== 'undefined') {
    const infuraUrl = 'https://ipfs.infura.io:5001';
    ipfs = create({url: infuraUrl});
}

const PlaylistLocalPage: NextPage<{ id: string }> = ({id}) => {
    const {createCollection, updateCollection, deleteCollection} = useTools();
    const {playlists, player, currentTrack, isPlaying, playlistCollection} = usePlaylist();
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

    const uploadToIpfs = async (data: any) => {
        try {
            const buffer = Buffer.from(JSON.stringify(data));
            const hash = await ipfs.add(buffer);

            return `ipfs://${hash.path}`;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const saveOnChain = async () => {
        const ipfsUri = await uploadToIpfs({
            data: {...playlist!.serialise()},
            collectionType: 'playlist',
            metadataVersion: '0.0.1'
        });

        if (!ipfsUri) {
            // Todo: handle error
            return;
        }

        if (playlist?.collectionId) {
            await updateCollection(playlist.collectionId, ipfsUri);
            playlist?.updateOnChainPlaylists();
            return;
        }

        const result = await createCollection(ipfsUri);
        // @ts-ignore
        playlist?.addToOnChainPlaylists(result?.[0].metadata.operation_result.big_map_diff?.[1].key?.args[1].int)
    };

    const deletePlaylist = async () => {
        if (!playlist) return;
        playlistCollection!.remove(playlist);
        if (!playlist.collectionId) return;
        await deleteCollection(playlist.collectionId);
    }

    const queueAll = () => {
        if(!playlist?.tracks) return;
        player!.queue.tracks = playlist?.tracks;
        player!.play();
    };

    return (
        <SidebarWrapper>
            <h2 className={styles.title}>{playlist?.title || 'Not found'}</h2>
            {playlist?.collectionId && <p className={styles.playlistId}>Playlist #{playlist.collectionId}</p>}
            <div className={styles.topBar}>
                <Button onClick={queueAll} className={styles.buttonSpacer}>Play All</Button>
                <Button onClick={saveOnChain} className={styles.buttonSpacer}>Save on Chain</Button>
                <Button onClick={deletePlaylist} className={styles.buttonSpacer}>Delete</Button>
                <LinkButton link={`https://music.orderandchaos.xyz/playlists/id/${playlist?.collectionId}`}/>
            </div>
            {playlist?.tracks.map(t => (
                <TrackRow key={t.token_id + '_' + t.contract} className={isCurrentTrack(t) ? styles.rowPlaying : ''}>
                    <ControlButton onClick={togglePlay(t)} className={styles.controlSpacer}>
                        {isCurrentTrack(t) && isPlaying
                            ? <PauseIcon/>
                            : <PlayIcon/>}
                    </ControlButton>
                    <TrackRowButton onClick={removeFromPlaylist(t)}>-</TrackRowButton>
                    <TrackMeta key={t.id}>
                        <Link href={`/track/${t.contract}/${t.token_id}`}>
                            <a>
                                <strong>{t.title}</strong>
                            </a>
                        </Link>
                        <br/>by {t.creators.map(c => c.alias || getTrimmedWallet(c.address))}
                    </TrackMeta>
                    <TrackLink track={t}/>
                </TrackRow>
            ))}
        </SidebarWrapper>
    )
}

export default PlaylistLocalPage;
