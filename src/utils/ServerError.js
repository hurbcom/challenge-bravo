/**
 * Error class for server errors.
 */
export default class ServerError extends Error {
    /**
     * Constructor.
     *
     * @param {string} [message] the error message
     */
    constructor(message) {
        super(message);

        this.error = message;
    }
}
