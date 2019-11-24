const winston = require('winston')
const fs = require('fs')

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs')
}


module.exports = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'logs/smartwaters.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
