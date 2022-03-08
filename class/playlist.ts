import {IToken, IUser} from "../api/get-tracks";
import {MissingArtifact} from "../exceptions";
import {nanoid} from 'nanoid'
import React, {Dispatch, SetStateAction} from "react";
import tokenToTrackTransformer from "../utilities/token-to-track-transformer";

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
    private _title: string;
    private _tracks: ITrack[] = [];
    private readonly _setTracks: React.Dispatch<React.SetStateAction<ITrack[]>>;

    constructor(
        title: string,
        setTracks: Dispatch<SetStateAction<ITrack[]>>,
    ) {
        this._title = title;
        // Todo: fetch local storage or playlist from ipfs
        this._setTracks = setTracks;
    }

    get title(): string {
        return this._title;
    }

    get tracks(): ITrack[] {
        return this._tracks;
    }

    append(token: IToken) {
        this._tracks.push(tokenToTrackTransformer(token));
        this._setTracks([...this._tracks]);
    }

    remove(track: ITrack) {
        this._tracks = this._tracks.filter(t => t !== track);
        this._setTracks([...this._tracks]);
    }
}
