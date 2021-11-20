export class CotationAlreadyExistsError extends Error {
    constructor() {
        super("Cotation already exists");
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CotationAlreadyExistsError.prototype);
    }
}