import { BaseExcepition } from "./baseException";

export class CantBeNegativeExcepition extends BaseExcepition {
    constructor(message: string) {
        super(message, 400);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
