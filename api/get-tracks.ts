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

const query = gql`
    query GetAudioTokens {
        token(where: {mime: {_ilike: "audio/%"}}, limit: 10) {
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

const getAudioTokens = async (): Promise<IToken[]> => {
    const response = await request('https://data.objkt.com/v2/graphql', query);
    return response?.token.map(parseToken) || [];
};

function parseToken(token: IToken): IToken {
    return {
        ...token,
        artifact_uri: getIpfsUrl(token.artifact_uri),
        thumbnail_uri: getIpfsUrl(token.thumbnail_uri),
        display_uri: getIpfsUrl(token.display_uri)
    };
}

export default getAudioTokens;
