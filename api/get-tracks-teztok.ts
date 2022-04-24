import {gql, request} from 'graphql-request';
import {getIpfsUrl} from "../utilities/get-ipfs-url";

export interface ITokenTezTok {
    token_id: string
    name: string
    artifact_uri?: string | null
    thumbnail_uri?: string | null
    display_uri?: string | null
    mime_type: string
    metadata: string
    fa2_address: string
    creators: string[]
}

const query = gql`
    query GetAudioTokens($offset: Int!, $limit: Int!) {
        tokens(
            where: {mime_type: {_ilike: "audio/%"}},
            limit: $limit,
            offset: $offset,
            order_by: {minted_at: desc}
        ) {
            token_id
            name
            artifact_uri
            thumbnail_uri
            display_uri
            mime_type
            artifact_metadata
            fa2_address
            creators
            formats
            artist_profile {
                alias
                twitter
                domain_name
                github
                logo
            }
        }
        tokens_aggregate(where: {mime_type: {_ilike: "audio/%"}}) {
            aggregate {
                count(distinct: true)
            }
        }
    }
`;

export const audioTokensApi = '/api/audio-tokens'

export interface IPaginatedTokens {
    tokens: ITokenTezTok[],
    page: number,
    limit: number,
    total: number
}

const getAudioTokensFetcher = async (url = audioTokensApi, page = 1, limit = 100): Promise<IPaginatedTokens> => {
    const offset = Math.max((page - 1) * limit, 0);
    const response = await request('https://unstable-do-not-use-in-production-api.teztok.com/v1/graphql', query, {offset, limit});
    const tokens = response?.tokens.map(parseToken);
    const total = response?.tokens_aggregate.aggregate.count;

    return {tokens, page, limit, total};
};

function parseToken(token: ITokenTezTok): ITokenTezTok {
    return {
        ...token,
        artifact_uri: getIpfsUrl(token.artifact_uri),
        thumbnail_uri: getIpfsUrl(token.thumbnail_uri),
        display_uri: getIpfsUrl(token.display_uri)
    };
}

export default getAudioTokensFetcher;
