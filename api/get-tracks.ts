import {gql, request} from 'graphql-request';
import {getIpfsUrl} from "../utilities/get-ipfs-url";

export interface IUser {
    address: string
    alias: string
    twitter: string
    logo: string
}

export interface IToken {
    token_id: string
    name: string
    artifact_uri?: string | null
    thumbnail_uri?: string | null
    display_uri?: string | null
    mime: string
    metadata: string
    fa: {
        contract: string
    }
    creators: {
        holder: IUser
    }[]
}

export const audioTokensLimit = 250;

const query = gql`
    query GetAudioTokens($offset: Int!, $limit: Int!) {
        token(
            where: {
                mime: {_ilike: "audio/%"}
            },
            limit: $limit,
            offset: $offset,
            order_by: {timestamp: desc}
        ) {
            token_id
            name
            artifact_uri
            thumbnail_uri
            display_uri
            mime
            metadata
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

const searchQuery = gql`
    query GetAudioTokens($offset: Int!, $limit: Int!, $search: String!) {
        token(
            where: {
                mime: {_ilike: "audio/%"},
                _or: [
                    {name: {_ilike: $search}},
                    {creators: {holder: {alias: {_ilike: $search}}}},
                ]
            },
            limit: $limit,
            offset: $offset,
            order_by: {timestamp: desc}
        ) {
            token_id
            name
            artifact_uri
            thumbnail_uri
            display_uri
            mime
            metadata
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

export const audioTokensApi = '/api/audio-tokens'

export interface IPaginatedTokens {
    tokens: IToken[],
    page: number,
    limit: number,
    total: number
}

const getAudioTokensFetcher = async (url = audioTokensApi, search = '', page = 1, limit = 100): Promise<IPaginatedTokens> => {
    const offset = Math.max((page - 1) * limit, 0);

    const response = search
        ? await request('https://data.objkt.com/v2/graphql', searchQuery, {offset, limit, search: `%${search}%`})
        : await request('https://data.objkt.com/v2/graphql', query, {offset, limit});
    const tokens = response?.token.map(parseToken);

    return {tokens, page, limit, total: 5000};
};

function parseToken(token: IToken): IToken {
    return {
        ...token,
        artifact_uri: getIpfsUrl(token.artifact_uri),
        thumbnail_uri: getIpfsUrl(token.thumbnail_uri),
        display_uri: getIpfsUrl(token.display_uri)
    };
}

export default getAudioTokensFetcher;
