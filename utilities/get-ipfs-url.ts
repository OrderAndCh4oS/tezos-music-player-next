export const getIpfsUrl = (ipfs?: string | null) =>
    ipfs
        ? `https://ipfs.io/ipfs/${ipfs.slice(7)}`
        : null;
