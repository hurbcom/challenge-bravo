const redis = require('redis'),
	Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);

let redisConnection = null;

const getClientAsync = async function ({ host, port }) {
	if (!host || !port) {
		throw new Error('Invalid config input. Use {host, port} as config');
	}
	if (!redisConnection) {
		redisConnection = new Promise((resolve, reject) => {
			const _redisConnection = redis.createClient(redisConfig.port, redisConfig.host, {
				no_ready_check: true,
				connect_timeout: redisConfig.connect_timeout || 2000
			});
			_redisConnection.on('connect', () => {
				resolve(_redisConnection);
			});

			_redisConnection.on('error', (err) => {
				console.log('Error on redis client');
				console.log(err);
				redisConnection = null;
				reject(err);
			});

			_redisConnection.on('end', () => {
				console.log('Redis client closing');
				redisConnection = null;
			});
		});
	}
	return redisConnection;
};
module.exports = { getClientAsync };
