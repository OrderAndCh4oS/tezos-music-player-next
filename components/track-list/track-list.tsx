import getAudioTokens, {IToken} from "../../api/get-tracks";
import {FC} from "react";
import useSWR from "swr";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";

interface ITrackListProps {
    swrKey: string
}

const TrackListComp: FC<ITrackListProps> = ({swrKey}) => {
    const {data: tokens} = useSWR(swrKey, getAudioTokens);
    const {player} = usePlaylist();

    const addToPlaylist = (token: IToken) => () => {
        player!.playlist.append(token);
    };

    return (
        <div>
            <h2>Track List</h2>
            {tokens?.map(t => (
                <TrackRow key={t.name}>
                    <TrackRowButton onClick={addToPlaylist(t)}>+</TrackRowButton>
                    <TrackMeta>
                        <strong>{t.name}</strong>
                        <br/>by {t.creators.map(c => c.holder.alias || c.holder.address)}
                    </TrackMeta>
                </TrackRow>
            ))}
        </div>
    )
};

export default TrackListComp;
