class RequestError extends Error {
    constructor (error, statusCode) {
        super(error || 'Request Error')
        this.statusCode = statusCode || 409
    }
}

export { RequestError }
