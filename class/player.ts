import {IPFS_URI} from "../constants";
import {IToken} from "../api/get-tracks";
import {getIpfsUrl} from "../utilities/get-ipfs-url";

export default class Player {
    private _loaded = false;
    private readonly _audio: HTMLAudioElement;

    constructor() {
        this._audio = new Audio();
        this._audio.addEventListener('loadedmetadata', () => {
            this._loaded = true;
        });
        if ('mediaSession' in navigator) {
            this._audio.addEventListener('timeupdate', () => {
                if (!isNaN(this._audio.duration)) {
                    navigator.mediaSession.setPositionState({
                        duration: this._audio.duration,
                        playbackRate: this._audio.playbackRate,
                        position: this._audio.currentTime
                    });
                }
            });
        }
    }

    get audio() {
        return this._audio;
    }

    private _currentTrack: IToken | null = null;

    set currentTrack(token: IToken) {
        if (!token.artifact_uri) return
        if (!token) {
            this._audio.pause();
            return
        }
        this._loaded = false;
        this._audio.setAttribute('src', token.artifact_uri);
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: token.name,
                artist: token.creators?.[0].holder.address || 'n/a',
                album: 'Music Player',
                artwork: [{src: getIpfsUrl(token.display_uri) || ''}]
            });
        }
        this._currentTrack = token
    }

    get ready() {
        return this._loaded;
    }

    get time() {
        return this._audio.currentTime;
    }

    get duration() {
        return this._loaded ? this._audio.duration : 0;
    }

    play() {
        this._audio.play();
    }
}
