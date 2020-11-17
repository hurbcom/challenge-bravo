import { createLogger, format, transports } from 'winston';
import { ValidationError } from 'yup';

const { combine, timestamp, printf, colorize } = format;

// Build the formater stack
let formatter = combine(
    timestamp(),
    printf(info => {
        if (info instanceof ValidationError) {
            return `${info.timestamp} [${info.level}]: ${info.message} - ${info.errors.join(', ')} \n${info.stack}`;
        }

        if (info instanceof Error) {
            return `${info.timestamp} [${info.level}]: ${info.message}\n${info.stack}`;
        }

        return `${info.timestamp} [${info.level}]: ${info.message}`;
    })
);

// In local environemnt colorize the whole output for easier reading
if (process.env.NODE_ENV === 'development') {
    formatter = combine(formatter, colorize({ all: true }));
}

/**
 * Create the logger to be used in the application.
 */
export default createLogger({
    level: process.env.LOG_LEVEL,
    exitOnError: false,
    format: formatter,
    transports: [new transports.Console({})]
});
