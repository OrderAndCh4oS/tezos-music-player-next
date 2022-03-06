import Playlist, {ITrack} from "./playlist";

export default class Player {
    private _loaded = false;
    private readonly _audio: HTMLAudioElement;
    private _playlist: Playlist;
    private _currentTrack: ITrack | null = null;

    constructor(playlist: Playlist) {
        this._playlist = playlist;
        this._audio = new Audio();
        this._audio.src = this._playlist.currentTrack?.src || ''
        this._audio.onended = () => {
            this.currentTrack = this._playlist.getNextTrack();
            this._audio.play();
        };
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

    get playlist(): Playlist {
        return this._playlist;
    }

    set currentTrack(track: ITrack) {
        if (!track.src) return
        if (!track) {
            this._audio.pause();
            return
        }
        this._loaded = false;
        this._audio.src = track.src;
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.creators[0].alias || 'n/a',
                album: 'Music Player',
                artwork: [{src: track.artwork}]
            });
        }
        this._currentTrack = track;
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
        if (!this._playlist.currentTrack) return;
        this.currentTrack = this._playlist.currentTrack;
        this._audio.play();
    }
}
