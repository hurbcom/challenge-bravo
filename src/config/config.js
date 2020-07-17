class Configuration
{
	static CRON_JOB_STRING = "0 * * ? * *";
	static DB_NAME = "currency-converter";
	static MONGODB_DEFAULT_URL = "mongodb://127.0.0.1:27017/";
}
module.exports = Configuration;