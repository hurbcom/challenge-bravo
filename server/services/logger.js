const fs = require('fs');
const winston = require('winston');

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'logs/currency-converter.log',
            maxsize: 1048576,
            maxFiles: 10,
            colorize: false
        })
    ]
});
