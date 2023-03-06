export default class NotFoundError extends Error {
    constructor(message: string) {
        super(`Not found ${message}`);
        this.name = "NotFoundError";
    }
}
