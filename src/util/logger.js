const LOGGER_LEVEL = process.env.LOGGER_LEVEL || "info";

const { transports, createLogger } = require("winston");

const winstonLogger = createLogger({
    transports: [
        new transports.Console({
            level: LOGGER_LEVEL,
        }),
    ],
});

const logger = {
    error: (message) => {
        winstonLogger.error(message);
    },
    info: (message) => {
        winstonLogger.info(message);
    },
    debug: (message) => {
        winstonLogger.debug(message);
    },
};

module.exports = logger;
