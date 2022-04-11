export const getTrimmedWallet = (walletAddress: string): string => {
    const start = walletAddress?.slice(0, 5) || '';
    const end = walletAddress?.slice(-5) || '';
    return `${start}...${end}`;
};
