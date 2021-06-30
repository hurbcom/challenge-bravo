class ResMessage {
    constructor () {
        this.messages = {
            success: {
                status: 200,
                message: 'Success'
            },
            success_created: {
                status: 201,
                message: 'Successfully created'
            },
            error_bad_request: {
                status: 400,
                message: 'Invalid params'
            },
            error_unprocessable_entity: {
                status: 422,
                message: 'Cannot process data'
            },
            error: {
                status: 500,
                message: 'Internal server error'
            }
        };

        this.codes = Object.keys(this.messages);
    }

    _isSuccessCode (code) {
        return code.includes('success');
    }

    _isErrorCode (code) {
        return code.includes('error');
    }

    _createMessage (messageCode, customData = {}) {
        if (!this.codes.includes(messageCode)) throw new Error('unknown message code');

        const messageObj = this.messages[messageCode];
        const customObj = {};

        const { message, data, error } = customData;
        
        if (message) customObj.message = message;

        if (this._isSuccessCode(messageCode)) {
            customObj.data = data || {};
        } else if (this._isErrorCode(messageCode)) {
            customObj.error = error || {};
        }

        return utils.newObject(messageObj, customObj);  
    }

    success (customData) {
        return this._createMessage('success', customData);
    }

    successCreated (customData) {
        return this._createMessage('success_created', customData);
    }

    badRequest (customData) {
        return this._createMessage('error_bad_request', customData);
    }

    unprocessableEntity (customData) {
        return this._createMessage('error_unprocessable_entity', customData);
    }

    internalError (customData) {
        return this._createMessage('error', customData);
    }
}

export default new ResMessage();