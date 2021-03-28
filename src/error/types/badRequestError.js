const ApiError = require("./apiError");

class BadRequest extends ApiError {
    constructor() {
        super("Bad Request", 500);
    }
}

module.exports = new BadRequest();
