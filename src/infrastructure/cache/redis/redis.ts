import Redis from 'ioredis';

export const redisClient = new Redis(Number(process.env.REDIS_PORT) || 6379, process.env.REDIS_HOST || 'localhost');