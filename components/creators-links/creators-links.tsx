import {FC} from "react";
import {ITrack} from "../../class/playlist";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";

const CreatorsLinks: FC<{ track: ITrack }> = ({track}) => <>
    {track.creators.map(c => <a
        href={`https://objkt.com/profile/${c.address}/created`}
        target='_blank'
        rel="noreferrer"
    >{c.alias || getTrimmedWallet(c.address)}</a>)}
</>;

export default CreatorsLinks;
