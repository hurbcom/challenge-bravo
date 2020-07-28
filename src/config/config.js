class Configuration {
    static DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    static CRON_JOB_STRING = '0 * * ? * *';

    static DB_NAME = 'currency-converter';

    static MONGODB_DEFAULT_URL = 'mongodb://mongo:27017/';

    static CORS_ALLOW_ORIGIN = '*';
}

module.exports = Configuration;
