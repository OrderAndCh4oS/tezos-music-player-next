import {FC} from "react";
import {ITrack} from "../../class/playlist";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";

interface IPlaylistProps {
}

const QueueComp: FC<IPlaylistProps> = () => {
    const {player, queuedTracks} = usePlaylist();

    const removeFromPlaylist = (track: ITrack) => () => {
        player!.queue.remove(track);
    };

    return (
        <div>
            {queuedTracks?.length ? queuedTracks?.map(t => (
                <TrackRow key={t.id}>
                    <TrackRowButton onClick={removeFromPlaylist(t)}>-</TrackRowButton>
                    <TrackMeta>
                        <strong>{t.title}</strong>
                        <br/>by {t.creators.map(c => c.alias || c.address)}
                    </TrackMeta>
                </TrackRow>
            )) : <p>No queued tracks</p>}
        </div>
    )
};

export default QueueComp;
