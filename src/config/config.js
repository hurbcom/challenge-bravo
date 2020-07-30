class Configuration {
    static DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

    static CRON_JOB_STRING = '0 * * ? * *';

    static DB_NAME = 'currency-converter';

    static DEFAULT_PORT = 3000;

    static DEFAULT_HOST = 'localhost';

    static MONGODB_DEFAULT_URL = 'mongodb://mongo:27017/';

    static CORS_ALLOW_ORIGIN = '*';

    static DEFAULT_CURRENCY_KEYS = ['usd', 'brl', 'eur', 'eth', 'btc'];
}

module.exports = Configuration;
