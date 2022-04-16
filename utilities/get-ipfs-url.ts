import {IPFS_URI} from "../constants";

export const getIpfsUrl = (ipfs?: string | null) =>
    ipfs
        ? `${IPFS_URI}/${ipfs.slice(7)}`
        : null;
