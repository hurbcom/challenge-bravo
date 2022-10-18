import { CacheModuleOptions } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

export const redisConfig = (): CacheModuleOptions => {
    if (process.env.NODE_ENV === 'development') require('dotenv/config');
    return {
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        no_ready_check: true,
        password: process.env.REDIS_PASSWORD || '',
    };
};
