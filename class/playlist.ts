import {IToken, IUser} from "../api/get-tracks";
import tokenToTrackTransformer from "../utilities/token-to-track-transformer";
import {nanoid} from "nanoid";

export interface ITrack {
    id: string
    title: string
    src: string
    mimeType: string
    creators: IUser[]
    artwork: string
}

export enum Mode {
    NORMAL,
    SHUFFLE
}

export default class Playlist {
    private _id = nanoid();
    private readonly _title: string;
    private _tracks: ITrack[] = [];

    constructor(
        title: string,
    ) {
        this._title = title;
        // Todo: fetch local storage or playlist from ipfs
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get tracks(): ITrack[] {
        return this._tracks;
    }

    append(track: ITrack) {
        this._tracks.push(track);
    }

    remove(track: ITrack) {
        this._tracks = this._tracks.filter(t => t !== track);
    }

    equal(playlist: Playlist) {
        return playlist.id === this._id;
    }
}
