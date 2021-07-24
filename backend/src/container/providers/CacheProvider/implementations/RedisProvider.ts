import Redis, { Redis as RedisClient } from 'ioredis';

import { cacheConfig } from '@configs/cache';

import { ICacheProvider } from '../models/ICacheProvider';

export class RedisProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);

    this.client.on('error', () => {
      this.client.disconnect();
    });
  }

  private logger({
    method,
    message,
    status,
  }: {
    method: string;
    message?: string;
    status?: 'success' | 'error';
  }): void {
    console.log(
      'Cache (RedisProvider) |'[status === 'error' ? 'red' : 'blue'],
      `${method}${message ? ` - ${message}` : ''}`,
    );
  }

  public async save(
    key: string,
    value: unknown,
    expiresIn?: Date,
  ): Promise<void> {
    try {
      this.logger({ method: 'save' });

      const cacheData = {
        data: value,
        ...(expiresIn ? { expiresIn } : {}),
      };

      await this.client.set(key, JSON.stringify(cacheData));
    } catch (error) {
      this.logger({
        method: 'save',
        message: 'Error saving cache.',
        status: 'error',
      });
      console.log(error);
    }
  }

  public async recover<T>(
    key: string,
  ): Promise<{ data: T; expiresIn?: Date } | null> {
    try {
      this.logger({ method: 'recover' });

      const data = await this.client.get(key);

      if (!data) {
        return null;
      }

      const parsedData = JSON.parse(data) as { data: T; expiresIn?: Date };

      if (
        parsedData.expiresIn &&
        new Date() >= new Date(parsedData.expiresIn)
      ) {
        await this.invalidate(key);
        return null;
      }

      return parsedData;
    } catch (error) {
      this.logger({
        method: 'recover',
        message: 'Error to recover cache.',
        status: 'error',
      });
      console.log(error);
      return null;
    }
  }

  public async invalidate(key: string): Promise<void> {
    try {
      this.logger({ method: 'invalidate' });

      await this.client.del(key);
    } catch (error) {
      this.logger({
        method: 'invalidate',
        message: 'Error to try invalidate cache.',
        status: 'error',
      });
      console.log(error);
    }
  }

  public async invalidatePrefix(
    prefix: string,
    fullPattern?: string,
  ): Promise<void> {
    try {
      this.logger({ method: 'invalidatePrefix' });

      const keys = await this.client.keys(fullPattern || `${prefix}:*`);

      const pipeline = this.client.pipeline();

      keys.forEach(key => {
        pipeline.del(key);
      });

      await pipeline.exec();
    } catch (error) {
      this.logger({
        method: 'invalidatePrefix',
        message: 'Error to try invalidate cache.',
        status: 'error',
      });
      console.log(error);
    }
  }
}
