"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotationAlreadyExistsError = void 0;
class CotationAlreadyExistsError extends Error {
    constructor() {
        super("Cotation already exists");
        Object.setPrototypeOf(this, CotationAlreadyExistsError.prototype);
    }
}
exports.CotationAlreadyExistsError = CotationAlreadyExistsError;
//# sourceMappingURL=CotationAlreadyExistsError.js.map