const moment = require('moment');
const Configuration = require('../config/config');

class ErrorMessage {
    constructor(status, message) {
        this.status = status;
        this.message = message;
        this.timestamp = moment().format(Configuration.DEFAULT_DATE_FORMAT);
    }
}
module.exports = ErrorMessage;
