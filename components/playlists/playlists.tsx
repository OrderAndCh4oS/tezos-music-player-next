import {FC} from "react";
import Playlist, {ITrack} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";

interface IPlaylistProps {
}

const PlaylistsComp: FC<IPlaylistProps> = () => {
    const {playlistCollection, playlists} = usePlaylist();

    const remove = (playlist: Playlist) => () => {
        playlistCollection?.remove(playlist);
    };

    return (
        <div>
            <h2>Playlists</h2>
            {playlists?.map(p => (
                <TrackRow key={p.id}>
                    <TrackRowButton onClick={remove(p)}>-</TrackRowButton>
                    <TrackMeta>
                        <strong>{p.title}</strong>
                    </TrackMeta>
                </TrackRow>
            ))}
        </div>
    )
};

export default PlaylistsComp;
