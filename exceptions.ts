export class MissingArtifact extends Error {
    constructor() {
        super('Missing artifact_uri');
    }
}

export class InvalidMimeType extends Error {
    constructor() {
        super('Invalid mimetype, audio/* only');
    }
}
