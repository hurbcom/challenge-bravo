import { CacheModuleOptions } from '@nestjs/common';

export const redisConfig = (): CacheModuleOptions => {
    if (process.env.NODE_ENV === 'development') require('dotenv/config');
    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    };
};
