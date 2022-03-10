import {Dispatch, SetStateAction} from "react";
import Playlist from "./playlist";

export default class PlaylistCollection {
    private _playlists: Playlist[] = [];
    private readonly _setPlaylists: Dispatch<SetStateAction<Playlist[]>>;

    constructor(setPlaylists: Dispatch<SetStateAction<Playlist[]>>) {
        this._setPlaylists = setPlaylists;
    }

    get playlists(): Playlist[] {
        return this._playlists;
    }

    add(title: string) {
        this._playlists.push(new Playlist(title));
        this._setPlaylists([...this._playlists]);
    }

    remove(playlist: Playlist) {
        this._playlists = this._playlists.filter(p => !p.equal(playlist));
        this._setPlaylists([...this._playlists]);
    }
}
