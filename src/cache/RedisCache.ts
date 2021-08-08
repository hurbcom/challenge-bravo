import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from './config';

export default class RedisCache {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any, expiryTimeInSeconds: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), "EX", expiryTimeInSeconds);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;
    console.log(parsedData);
    return parsedData;
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}