import winston from 'winston'
import { LOGGER_LEVEL, IS_TEST } from './index.js'

const winstonLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: LOGGER_LEVEL || 'info',
            silent: IS_TEST
        })
    ]
})

const formatMessage = (message) => {
    return `[${logger.requestId}] [${logger.method}] [${message}]`
}

const logger = {
    log: (level, message) => {
        winstonLogger.log(level, formatMessage(message))
    },
    error: (message) => {
        winstonLogger.error(formatMessage(message))
    },
    warn: (message) => {
        winstonLogger.warn(formatMessage(message))
    },
    verbose: (message) => {
        winstonLogger.verbose(formatMessage(message))
    },
    info: (message) => {
        winstonLogger.info(formatMessage(message))
    },
    debug: (message) => {
        winstonLogger.debug(formatMessage(message))
    },
    silly: (message) => {
        winstonLogger.silly(formatMessage(message))
    },
    requestId: null,
    method: null
}

export default logger
