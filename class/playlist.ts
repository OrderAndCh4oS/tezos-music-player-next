import {IUser} from "../api/get-tracks";
import {nanoid} from "nanoid";
import PlaylistCollection from "./playlist-collection";

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

export interface IPlaylistStruct {
    id: string,
    title: string,
    tracks: ITrack[]
}

export default class Playlist implements IPlaylistStruct {
    private _id = nanoid();
    private readonly _title: string;
    private _tracks: ITrack[] = [];
    private _playlistCollection: PlaylistCollection;

    constructor(
        playlistCollection: PlaylistCollection,
        title: string,
        id?: string,
        tracks?: ITrack[]
    ) {
        this._playlistCollection = playlistCollection;
        this._title = title;
        if (id) this._id = id;
        if (tracks) this._tracks = tracks;
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
        this._playlistCollection.save();
    }

    remove(track: ITrack) {
        this._tracks = this._tracks.filter(t => t !== track);
        this._playlistCollection.save();
    }

    equal(playlist: Playlist) {
        return playlist.id === this._id;
    }

    serialise(): IPlaylistStruct {
        return {
            id: this._id,
            title: this._title,
            tracks: this._tracks,
        }
    }
}
