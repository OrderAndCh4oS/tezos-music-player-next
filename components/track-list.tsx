import getAudioTokens, {IToken} from "../api/get-tracks";
import {FC} from "react";
import useSWR from "swr";
import Player from "../class/player";

interface ITrackListProps {
    player: Player,
    swrKey: string
}

const TrackList: FC<ITrackListProps> = ({swrKey, player}) => {
    const {data: tokens} = useSWR(swrKey, getAudioTokens);
    const handleSelectTrack = (token: IToken) => () => {
        player.currentTrack = token;
    };
    return (
        <div>
            {tokens?.map(t => <button
                key={t.name}
                onClick={handleSelectTrack(t)}
            >{t.name}</button>)}
        </div>
    )
};

export default TrackList;
