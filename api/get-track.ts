import {gql, request} from "graphql-request";
import {getIpfsUrl} from "../utilities/get-ipfs-url";
import {OBJKT_GQL} from "../constants";
import {IToken} from "./get-tracks";

export interface ITokenDetail extends IToken {
    description: string
    lowest_ask: number
    highest_offer: number
    supply: number
    asks: {
        amount: number
        amount_left: number
    }
}

export interface ITrackResponse {
    token: ITokenDetail | null,
    contract: string,
    tokenId: string
}

const query = gql`
    query GetTrack($contract: String!, $tokenId: String!) {
        token(where: {
            fa_contract: {_eq: $contract},
            token_id: {_eq: $tokenId}
        }) {
            token_id
            name
            description
            artifact_uri
            thumbnail_uri
            display_uri
            mime
            metadata
            lowest_ask
            highest_offer
            supply
            asks {
                amount
                amount_left
            }
            fa {
                contract
            }
            creators {
                holder {
                    address
                    alias
                    twitter
                    logo
                }
            }
        }
    }
`;

export const trackApi = '/api/track'

const getTrackFetcher = async (url = trackApi, contract: string, tokenId: string): Promise<ITrackResponse> => {
    const response = await request(OBJKT_GQL, query, {contract, tokenId});
    const tokens = response?.token.map(parseToken);

    return {token: tokens?.[0] || null, contract, tokenId};
};

function parseToken(token: IToken): IToken {
    return {
        ...token,
        artifact_uri: token.artifact_uri,
        thumbnail_uri: token.thumbnail_uri,
        display_uri: token.display_uri
    };
}

export default getTrackFetcher;
