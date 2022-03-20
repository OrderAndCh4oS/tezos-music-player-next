import {FC} from "react";
import Playlist from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";
import Link from "next/link";

interface IPlaylistProps {
}

const PlaylistsComp: FC<IPlaylistProps> = () => {
    const {playlistCollection, playlists, player} = usePlaylist();

    const handleRemove = (playlist: Playlist) => () => {
        playlistCollection?.remove(playlist);
    };

    const handleAddToQueue = (playlist: Playlist) => () => {
        player?.queue.queuePlaylist(playlist);
        player?.restart();
    };

    return (
        <div>
            <h2>Playlists</h2>
            {playlists?.map(p => (
                <TrackRow key={p.id}>
                    <TrackRowButton
                        onClick={handleAddToQueue(p)}
                    >{'>'}</TrackRowButton>
                    <TrackRowButton onClick={handleRemove(p)}>-</TrackRowButton>
                    <TrackMeta>
                        <Link
                            href={{
                                pathname: `/playlist/[id]`,
                                query: {id: p.id}
                            }}
                        >
                            <a>
                                <strong>{p.title}</strong>
                            </a>
                        </Link>
                    </TrackMeta>
                </TrackRow>
            ))}
        </div>
    )
};

export default PlaylistsComp;
