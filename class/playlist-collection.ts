import {Dispatch, SetStateAction} from "react";
import Playlist, {IPlaylistStruct} from "./playlist";

export default class PlaylistCollection {
    private _playlists: Playlist[] = [];
    private readonly _setPlaylists: Dispatch<SetStateAction<Playlist[]>>;
    private readonly _setOnChainPlaylists: Dispatch<SetStateAction<any>>;

    constructor(
        setPlaylists: Dispatch<SetStateAction<Playlist[]>>,
        setOnChainPlaylists: Dispatch<SetStateAction<any>>
    ) {
        this._setPlaylists = setPlaylists;
        this._setOnChainPlaylists = setOnChainPlaylists;
        if (typeof window !== 'undefined') {
            const playlistStore = window.localStorage.getItem('playlists');
            if (playlistStore) {
                const playlists = JSON.parse(playlistStore).playlists
                    .map((playlist: IPlaylistStruct) => new Playlist(
                        this,
                        playlist.title,
                        playlist.id,
                        playlist.tracks
                    ));
                this._playlists = playlists;
                this._setPlaylists(playlists);
            }
        }
    }

    get playlists(): Playlist[] {
        return this._playlists;
    }

    add(title: string) {
        this._playlists.push(new Playlist(this, title));
        this.update();
    }

    remove(playlist: Playlist) {
        this._playlists = this._playlists.filter(p => !p.equal(playlist));
        this.update();
    }

    update() {
        this._setPlaylists([...this._playlists]);
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('playlists', JSON.stringify(this.serialise()));
    }

    merge(playlistData: IPlaylistStruct) {
        const existingPlaylist = this.findById(playlistData.id);
        if (existingPlaylist) {
            existingPlaylist.collectionId = playlistData.collectionId;
            existingPlaylist.mergeTracks(playlistData.tracks);
            this.update();
            return;
        }
        const playlist = new Playlist(this, playlistData.title, playlistData.id, playlistData.tracks);
        this._playlists.push(playlist);
        this.update();
    }

    updateOnChainPlaylists = (playlist: any) => {
        this._setOnChainPlaylists((prev: any) =>
            [...prev.filter((p: any) => p.collectionId !== playlist.collectionId), playlist.serialise()]
        );
    }

    findById(playlistId: string) {
        return this._playlists.find(p => p.id === playlistId) || null;
    }

    private serialise() {
        return {playlists: this._playlists.map(p => p.serialise())};
    }
}
