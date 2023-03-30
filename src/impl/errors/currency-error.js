"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CurrencyError extends Error {
    constructor(message) {
        super(message);
        this.name = "CurrencyError";
        this.statusCode = 500;
    }
    getStatusCode() {
        return this.statusCode;
    }
}
exports.default = CurrencyError;
