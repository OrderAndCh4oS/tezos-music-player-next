export const getIpfsUrl = (ipfs?: string | null) =>
    ipfs
        ? `https://orderandchaos.mypinata.cloud/ipfs/${ipfs.slice(7)}`
        : null;
