"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(message) {
        super(message);
        this.name = "ThirdPartyApiError";
        this.statusCode = 500;
    }
    getStatusCode() {
        return this.statusCode;
    }
}
exports.default = ApiError;
