class ResMessage {
    constructor () {
        // -
    }

    _generateCustomSuccessObj ({ message, data } = {}) {
        const successObj = {}

        if (message) successObj.message = message;
        if (data) successObj.data = data;

        return successObj; 
    }

    _generateCustomErrorObj ({ message, error } = {}) {
        const errorObj = {}

        if (message) errorObj.message = message;
        if (error) errorObj.error = error;

        return errorObj; 
    }

    success (params) {
        const resObj = {
            status: 200,
            message: 'Success',
            data: {}
        };
        const customResObj = this._generateCustomSuccessObj(params);

        return utils.newObject(resObj, customResObj);  
    };

    successCreated (params) {
        const resObj = {
            status: 201,
            message: 'Successfully created',
            data: {}
        };
        const customResObj = this._generateCustomSuccessObj(params);

        return utils.newObject(resObj, customResObj);  
    };

    badRequest (params) {
        const resObj = {
            status: 400,
            message: 'Invalid params',
            error: {}
        };
        const customResObj = this._generateCustomErrorObj(params);

        return utils.newObject(resObj, customResObj);
    };

    unprocessableEntity (params) {
        const resObj = {
            status: 422,
            message: 'Cannot process data',
            error: {}
        };
        const customResObj = this._generateCustomErrorObj(params);

        return utils.newObject(resObj, customResObj);
    };

    internalError (params) {
        const resObj = {
            status: 500,
            message: 'Internal server error',
            error: {}
        };
        const customResObj = this._generateCustomErrorObj(params);

        return utils.newObject(resObj, customResObj);
    };
}

export default new ResMessage();