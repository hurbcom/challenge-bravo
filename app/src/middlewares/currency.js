const validators = require("../validators/currency")();

module.exports = app => {
    const middleware = {
        validate: async (request, response, next) => {
            try {
                request = validators.convert_parameters(request);
                next();
            } catch (error) {
                return response.status(400).json({
                    error: error.message
                });
            }
        }
    };

    return middleware;
};
