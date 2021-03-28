const ApiError = require("./apiError");

class CurrencyNotFoundError extends ApiError {
    constructor() {
        super("Currency not found.", 404);
    }
}

module.exports = CurrencyNotFoundError;
