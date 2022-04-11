import {IUser} from "../api/get-tracks";
import {nanoid} from "nanoid";
import PlaylistCollection from "./playlist-collection";

export interface ITrack {
    id: string
    token_id: string
    contract: string
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
    private readonly _id = nanoid();
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
        this._playlistCollection.update();
    }

    remove(track: ITrack) {
        this._tracks = this._tracks.filter(t => t !== track);
        this._playlistCollection.update();
    }

    equal(playlist: Playlist) {
        return playlist.id === this._id;
    }

    mergeTracks(tracks: ITrack[]) {
        const nextTracks = [...this._tracks];
        let lastFoundIndex;
        let inserted = 0;
        for (let i = 0; i < tracks.length; i++){
            const track = tracks[i];
            const foundIndex = this._tracks.findIndex(t => t.id === track.id);
            if(foundIndex !== -1) {
                lastFoundIndex = i;
                continue;
            }
            if(foundIndex + inserted < length) {
                nextTracks.splice(foundIndex + inserted, 0, track);
            } else {
                nextTracks.push(track);
            }
            inserted++;
        }
    }

    serialise(): IPlaylistStruct {
        return {
            id: this._id,
            title: this._title,
            tracks: this._tracks,
        }
    }
}
