import {useContext} from 'react';
import {PlaylistContext} from "../context/playlist";

const usePlaylist = () => useContext(PlaylistContext);

export default usePlaylist;
