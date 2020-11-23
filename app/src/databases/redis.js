import redis from 'redis';
import ExpressRedisCache from 'express-redis-cache';

export const client = redis.createClient({
    host: 'redis-server'
});

export const cache = ExpressRedisCache({
    client: client,
    expire: 10, 
});