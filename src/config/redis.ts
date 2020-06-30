import { RedisOptions } from 'ioredis'

interface IRedisConfig {
    driver: 'redis'

    config: {
        redis: RedisOptions;
    };
}

export default {
    driver: 'redis',

    config: {
        redis: {
            host: '172.18.0.2' || 'localhost',
            port: 6379,
            password: undefined,
        }
    }
} as IRedisConfig;