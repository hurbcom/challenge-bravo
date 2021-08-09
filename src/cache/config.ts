import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  config: {
    redis: RedisOptions;
  };
  driver: string;
}

export default  {
    config: {
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT || 6379,
            username: process.env.REDIS_USERNAME || undefined,
            password: process.env.REDIS_PASS || undefined,
        } 
    },
    driver: 'redis',
}  as ICacheConfig