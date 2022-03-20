import getAudioTokensFetcher, {IToken} from "../../api/get-tracks";
import {FC} from "react";
import useSWR from "swr";
import usePlaylist from "../../hooks/use-playlist";
import TrackRow from "../track-row/track-row";
import TrackRowButton from "../track-row-button/track-row-button";
import TrackMeta from "../track-meta/track-meta";
import tokenToTrackTransformer from "../../utilities/token-to-track-transformer";
import AddTrackButton from "../add-track-button/add-track-button";
import serialise from "../../utilities/serialise";
import NextPrev from "../next-prev";

interface ITrackListProps {
    swrKey: string
}

const TrackListComp: FC<ITrackListProps> = ({swrKey}) => {
    const {data} = useSWR(swrKey, getAudioTokensFetcher, {use: [serialise]});
    const {player} = usePlaylist();

    const playNow = (token: IToken) => () => {
        const track = tokenToTrackTransformer(token);
        player?.queue.unshift(track)
        player!.currentTrack = track;
        player!.play();
    };

    return (
        <div>
            <h2>Track List</h2>
            {data?.tokens?.map(t => (
                <TrackRow key={t.token_id + '_' + t.fa.contract}>
                    <TrackRowButton onClick={playNow(t)}>{'>'}</TrackRowButton>
                    <AddTrackButton track={tokenToTrackTransformer(t)}>+</AddTrackButton>
                    <TrackMeta>
                        <strong>{t.name}</strong>
                        <br/>by {t.creators.map(c => c.holder.alias || c.holder.address)}
                    </TrackMeta>
                </TrackRow>
            ))}
            <NextPrev swrKey={swrKey}/>
        </div>
    )
};

export default TrackListComp;
