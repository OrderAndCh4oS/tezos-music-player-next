import Playlist from "./track-queue";
import TrackQueue from "./track-queue";
import {Dispatch, SetStateAction} from "react";
import {ITrack} from "./playlist";

export default class Player {
    private _loaded = false;
    private _currentTrack: ITrack | null = null;
    private _setIsPlaying: Dispatch<SetStateAction<boolean>>;
    private readonly _audio: HTMLAudioElement;
    private readonly _queue: TrackQueue;
    private readonly _setCurrentTrack: Dispatch<SetStateAction<ITrack | null>>;

    constructor(
        queue: TrackQueue,
        setCurrentTrack: Dispatch<SetStateAction<ITrack | null>>,
        setIsPlaying: Dispatch<SetStateAction<boolean>>
    ) {
        this._setIsPlaying = setIsPlaying;
        this._queue = queue;
        this._setCurrentTrack = setCurrentTrack;
        this._audio = new Audio();
        this._audio.src = this._queue.currentTrack?.src || ''
        this._audio.onended = () => {
            this.currentTrack = this._queue.getNextTrack();
            this._audio.play();
        };
        this._audio.addEventListener('loadedmetadata', () => {
            this._loaded = true;
        });
        this._audio.addEventListener('playing', () => {
            this.setIsPlaying(true);
        });
        this._audio.addEventListener('pause', () => {
            this.setIsPlaying(false);
        });
        this._audio.addEventListener('ended', () => {
            this.setIsPlaying(false);
        });
        if ('mediaSession' in navigator) {
            this._audio.addEventListener('timeupdate', () => {
                if (!isNaN(this._audio.duration) && this._audio.duration !== Infinity) {
                    navigator.mediaSession.setPositionState({
                        duration: this._audio.duration,
                        playbackRate: this._audio.playbackRate,
                        position: this._audio.currentTime
                    });
                }
            });
        }
    }

    get setIsPlaying(): React.Dispatch<React.SetStateAction<boolean>> {
        return this._setIsPlaying;
    }

    get audio() {
        return this._audio;
    }

    get queue(): Playlist {
        return this._queue;
    }

    set currentTrack(track: ITrack) {
        if (!track.src) return
        if (!track) {
            this._audio.pause();
            return
        }
        this._setCurrentTrack(track);
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
        if (!this._currentTrack && this._queue.currentTrack) {
            this.currentTrack = this._queue.currentTrack;
        }
        this._audio.play();
    }

    pause() {
        this._audio.pause();
    }

    restart() {
        this._audio.pause();
        if(!this._queue.currentTrack) return;
        this.currentTrack = this._queue.currentTrack;
        this._audio.play();
    }

    next() {
        this._audio.pause();
        const track = this._queue.getNextTrack();
        if(!track) return;
        this.currentTrack = track;
        this._audio.play();
    }

    previous() {
        this._audio.pause();
        const track = this._queue.getPreviousTrack();
        if(!track) return;
        this.currentTrack = track;
        this._audio.play();
    }
}
