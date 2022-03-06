import getAudioTokens, {IToken} from "../api/get-tracks";
import {FC, useEffect} from "react";
import useSWR from "swr";
import usePlaylist from "../hooks/use-playlist";

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
            {tokens?.map(t => <button
                key={t.name}
                onClick={addToPlaylist(t)}
            >{t.name}</button>)}
        </div>
    )
};

export default TrackListComp;
