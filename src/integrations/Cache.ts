/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Redis from 'ioredis';

class Cache {
    redis: Redis.Redis;

    constructor() {
      this.redis = new Redis({
        host: process.env.REDIS_HOST,
        port: 6379,
        keyPrefix: 'cache:',
      });
    }

    async get(key: Redis.KeyType) {
      const value = await this.redis.get(key);

      return value ? JSON.parse(value) : null;
    }

    set(key: Redis.KeyType, value: any, timeExp: string | number | undefined) {
      return this.redis.set(key, JSON.stringify(value), 'EX', timeExp);
    }

    del(key: Redis.KeyType) {
      return this.redis.del(key);
    }
}
export default Cache;
