import {IToken, IUser} from "../api/get-tracks";
import {MissingArtifact} from "../exceptions";
import {nanoid} from 'nanoid'
import React, {Dispatch, SetStateAction} from "react";

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
    private _cursor = 0;
    private _tracks: ITrack[] = [];
    private _mode: Mode = Mode.NORMAL
    private _setTracks: React.Dispatch<React.SetStateAction<ITrack[]>>;
    private _setCurrentTrack: React.Dispatch<React.SetStateAction<ITrack | null>>;
    private _setMode: React.Dispatch<React.SetStateAction<Mode>>;

    constructor(
        setTracks: Dispatch<SetStateAction<ITrack[]>>,
        setCurrentTrack: Dispatch<SetStateAction<ITrack | null>>,
        setMode: Dispatch<SetStateAction<Mode>>
    ) {
        this._setTracks = setTracks;
        this._setCurrentTrack = setCurrentTrack;
        this._setMode = setMode;
        // Todo: fetch local storage or playlist from ipfs
    }

    get tracks(): ITrack[] {
        return this._tracks;
    }

    get currentTrack() {
        return this._tracks.length ? this._tracks[this._cursor] : null;
    }

    get mode(): Mode {
        return this._mode;
    }

    append(token: IToken) {
        this._tracks.push(this._makeTrack(token));
        this._setTracks([...this._tracks]);
    }

    remove(track: ITrack) {
        this._tracks = this._tracks.filter(t => t !== track);
        this._setTracks([...this._tracks]);
    }

    toggleShuffle() {
        this._mode = this._mode === Mode.SHUFFLE
            ? Mode.NORMAL
            : Mode.SHUFFLE;
        this._setMode(this._mode);
    }

    getNextTrack() {
        switch (this._mode) {
            case Mode.NORMAL:
                this._cursor = (this._cursor + 1) % this._tracks.length;
                this._setCurrentTrack(this._tracks[this._cursor]);
                return this._tracks[this._cursor];
            case Mode.SHUFFLE:
                this._cursor = ~~(Math.random() * this._tracks.length);
                this._setCurrentTrack(this._tracks[this._cursor]);
                return this._tracks[this._cursor];
        }
    }

    getPreviousTrack() {
        switch (this._mode) {
            case Mode.NORMAL:
                this._cursor = (this._cursor - 1) % this._tracks.length;
                this._setCurrentTrack(this._tracks[this._cursor]);
                return this._tracks[this._cursor];
            case Mode.SHUFFLE:
                this._cursor = ~~(Math.random() * this._tracks.length);
                this._setCurrentTrack(this._tracks[this._cursor]);
                return this._tracks[this._cursor];
        }
    }

    private _makeTrack(token: IToken): ITrack {
        if (typeof token.artifact_uri !== 'string') {
            throw new MissingArtifact()
        }

        return {
            id: nanoid(),
            title: token.name,
            src: token.artifact_uri || '',
            mimeType: token.mime,
            creators: token.creators.map(c => c.holder),
            artwork: token.display_uri || ''
        }
    }
}
