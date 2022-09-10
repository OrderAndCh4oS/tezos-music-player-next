import {IToken} from "../api/get-tracks";
import {MissingArtifact} from "../exceptions";
import {nanoid} from "nanoid";
import {ITrack} from "../class/playlist";

const tokenToTrackTransformer = (token: IToken): ITrack => {
    if (typeof token.artifact_uri !== 'string') {
        throw new MissingArtifact()
    }

    return {
        id: nanoid(),
        token_id: token.token_id,
        contract: token.fa.contract,
        title: token.name,
        artifactUri: token.artifact_uri || '',
        mimeType: token.mime,
        creators: token.creators.map(c => c.holder),
        artwork: token.display_uri || ''
    }
}

export default tokenToTrackTransformer
