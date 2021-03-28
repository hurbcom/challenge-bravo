class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "API_ERROR";
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
