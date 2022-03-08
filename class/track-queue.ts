import {ITrack, Mode} from "./playlist";
import {Dispatch, SetStateAction} from "react";

export default class TrackQueue {
    private _cursor = 0;
    private _tracks: ITrack[] = [];
    private _mode: Mode = Mode.NORMAL;
    private readonly _setMode: Dispatch<SetStateAction<Mode>>;

    constructor(setMode: Dispatch<SetStateAction<Mode>>
    ) {
        this._setMode = setMode;
    }

    get currentTrack() {
        return this._tracks.length ? this._tracks[this._cursor] : null;
    }

    get mode(): Mode {
        return this._mode;
    }

    get tracks(): ITrack[] {
        return this._tracks;
    }
    
    set tracks(value: ITrack[]) {
        this._tracks = value;
    }

    push(track: ITrack) {
        this._tracks.push(track);
    }

    unshift(track: ITrack) {
        this._tracks.unshift(track);
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
                return this._tracks[this._cursor];
            case Mode.SHUFFLE:
                this._cursor = ~~(Math.random() * this._tracks.length);
                return this._tracks[this._cursor];
        }
    }

    getPreviousTrack() {
        switch (this._mode) {
            case Mode.NORMAL:
                this._cursor = (this._cursor - 1) % this._tracks.length;
                return this._tracks[this._cursor];
            case Mode.SHUFFLE:
                this._cursor = ~~(Math.random() * this._tracks.length);
                return this._tracks[this._cursor];
        }
    }
}
