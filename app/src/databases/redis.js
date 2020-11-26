import * as redis from 'redis';
import { promisify } from 'util';
import ExpressRedisCache from 'express-redis-cache';

export let instance = {};

function redisConnect() {
    const client = redis.createClient({
        host: 'redis-server'
    });

    const redisAsync = {
        get: promisify(client.get).bind(client),
        set: promisify(client.set).bind(client)
    }

    client.on('connect', () => console.log('[ REDIS ] Connected!'));
    client.on('error', (err) => console.log(`[ REDIS ] Failed to connect: ${err}`));

    const cache = ExpressRedisCache({
        client: client,
        expire: 10, 
    });

    instance = { client: redisAsync, cache };
    return instance;
}

export default redisConnect;