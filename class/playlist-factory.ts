import {Dispatch, SetStateAction} from "react";
import {ITrack} from "./playlist";

export default class PlaylistFactory {
    constructor(setTracks: Dispatch<SetStateAction<ITrack[]>>) {

    }

    make(name: string) {}
}
