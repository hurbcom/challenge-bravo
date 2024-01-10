export class Failure {
    constructor(public readonly msg: string, public readonly param: string) {}
}

export default class ValidationError extends Error {
    public readonly msg = "ValidationError";
    constructor(public readonly errors: Failure[]) {
        super();
    }
}
