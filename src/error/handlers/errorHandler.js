const logger = require("../../util/logger");
const ApiError = require("../types/apiError");

const genericErrorHandler = async (err, req, res, next) => {
    logger.info(`[GENERIC ERROR] ${err.message}`);
    res.status(500).json({ error: err.message });
};

const apiErrorHandler = async (err, req, res, next) => {
    if (err instanceof ApiError) {
        logger.error(`[API ERROR] ${err.message}`);
        res.status(err.status).json({ error: err.message });
    } else {
        next(err);
    }
};

module.exports = {
    genericErrorHandler,
    apiErrorHandler,
};
