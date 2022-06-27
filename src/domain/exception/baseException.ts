export abstract class BaseExcepition extends Error {
    private readonly status: number;

    constructor(message: string, status = 400) {
        super(message);
        this.status = status;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    getStatus(): number {
        return this.status;
    }
}
