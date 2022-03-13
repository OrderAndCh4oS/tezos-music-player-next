import {Dispatch, SetStateAction} from "react";
import Playlist, {IPlaylistStruct} from "./playlist";

export default class PlaylistCollection {
    private _playlists: Playlist[] = [];
    private readonly _setPlaylists: Dispatch<SetStateAction<Playlist[]>>;

    constructor(setPlaylists: Dispatch<SetStateAction<Playlist[]>>) {
        this._setPlaylists = setPlaylists;
        if (typeof window !== 'undefined') {
            const playlistStore = window.localStorage.getItem('playlists');
            if (playlistStore) {
                console.log('type', typeof JSON.parse(playlistStore).playlists);
                const playlists = JSON.parse(playlistStore).playlists
                    .map((playlist: IPlaylistStruct) => new Playlist(
                        this,
                        playlist.title,
                        playlist.id,
                        playlist.tracks
                    ));
                this._setPlaylists(playlists);
            }
        }
    }

    get playlists(): Playlist[] {
        return this._playlists;
    }

    add(title: string) {
        this._playlists.push(new Playlist(this, title));
        this.save();
        this._setPlaylists([...this._playlists]);
    }

    remove(playlist: Playlist) {
        this._playlists = this._playlists.filter(p => !p.equal(playlist));
        this.save();
        this._setPlaylists([...this._playlists]);
    }

    save() {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('playlists', JSON.stringify(this.serialise()));
    }

    private serialise() {
        return {playlists: this._playlists.map(p => p.serialise())};
    }
}
