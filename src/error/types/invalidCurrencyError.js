const ApiError = require("./apiError");

class invalidCurrencyError extends ApiError {
    constructor() {
        super("Invalid Currency.", 400);
    }
}

module.exports = invalidCurrencyError;
