import getAudioTokens, {IToken} from "../../api/get-tracks";
import {FC} from "react";
import useSWR from "swr";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";
import tokenToTrackTransformer from "../../utilities/token-to-track-transformer";

interface ITrackListProps {
    swrKey: string
}

const TrackListComp: FC<ITrackListProps> = ({swrKey}) => {
    const {data: tokens} = useSWR(swrKey, getAudioTokens);
    const {player} = usePlaylist();

    const addToPlaylist = (token: IToken) => () => {
        player!.playlist.append(token);
    };

    const playNow = (token: IToken) => () => {
        player!.currentTrack = tokenToTrackTransformer(token);
        player!.play();
    };

    return (
        <div>
            <h2>Track List</h2>
            {tokens?.map(t => (
                <TrackRow key={t.token_id + '_' + t.fa.contract}>
                    <TrackRowButton onClick={playNow(t)}>{'>'}</TrackRowButton>
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
