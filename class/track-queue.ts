import {ITrack, Mode} from "./playlist";
import {Dispatch, SetStateAction} from "react";

export default class TrackQueue {
    private _cursor = 0;
    private _tracks: ITrack[] = [];
    private _mode = Mode.NORMAL;
    private readonly _setMode: Dispatch<SetStateAction<Mode>>;
    private readonly _setQueuedTracks: Dispatch<SetStateAction<ITrack[]>>;

    constructor(
        setMode: Dispatch<SetStateAction<Mode>>,
        setQueuedTracks: Dispatch<SetStateAction<ITrack[]>>,
    ) {
        this._setMode = setMode;
        this._setQueuedTracks = setQueuedTracks;
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
        this._setQueuedTracks([...this._tracks])
    }

    push(track: ITrack) {
        this._tracks.push(track);
        this._setQueuedTracks([...this._tracks])
    }

    unshift(track: ITrack) {
        this._tracks.unshift(track);
        this._setQueuedTracks([...this._tracks])
    }

    remove(track: ITrack) {
        this._tracks = this._tracks.filter(t => t.id !== track.id);
        this._setQueuedTracks([...this._tracks])

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
