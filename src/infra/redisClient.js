import redis from 'redis';
import Promise from 'bluebird';

Promise.promisifyAll(redis.RedisClient.prototype);

let redisConnection = null;

function getClientAsync ({ host, port }) {
	if (!host || !port) {
		throw new Error('Invalid config input. Use {host, port} as config');
	}
	if (redisConnection) return redisConnection;

	redisConnection = new Promise((resolve, reject) => {
		const _redisConnection = redis.createClient(port, host, {
			no_ready_check: true,
			connect_timeout: 1000
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
	
	return redisConnection;
};
export default { getClientAsync };
