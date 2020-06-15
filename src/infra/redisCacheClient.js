import { connections } from '../config.js';
import redisClient from './redisClient.js';
import _ from 'lodash';

async function getAsync(key) {
	const redisCacheConnection = await redisClient.getClientAsync(connections.redisCache);

	let results = await redisCacheConnection.getAsync(key);

	if (results) {
		results = JSON.parse(results);

		if (!_.keys(results).length) {
			results = null;
		}
	}

	return results;
}

async function setAsync(key, value) {
	const redisCacheConnection = await redisClient.getClientAsync(connections.redisCache);

	const stringValue = typeof value != 'string' ? JSON.stringify(value) : value;

	return redisCacheConnection.setAsync(key, stringValue);
}

async function delAsync(key) {
	const redisCacheConnection = await redisClient.getClientAsync(connections.redisCache);

	return redisCacheConnection.setAsync(key, '{}', 'EX', 1);
}

export default { getAsync, setAsync, delAsync };
