const environment = process.env.API_ENVIRONMENT;

let connections = {
	currenciesDb: {
		connectionLimit: process.env.MYSQL_CONNECTIONS_LIMIT || 10,
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USER || 'root',
		password: process.env.MYSQL_PASSWORD || '_hard_password_',
		database: 'currencies',
		multipleStatements: true
	},
	redisCache: {
		port:  process.env.CACHE_REDIS_PORT || 6379,
		host: process.env.CACHE_REDIS_HOST || 'localhost'
	}
}

let appParameters = {
	cors: [/.*/],
	fixerApiKey: 'b974365156ad62aeea355a9a149ede01',
	currencyLayerApiKey: '8a521dbb148e80fda3efb7eed8148299'
	
}

export {connections, appParameters};