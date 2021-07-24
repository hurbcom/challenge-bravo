import { ICacheProvider } from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(
    key: string,
    value: unknown,
    expiresIn?: Date,
  ): Promise<void> {
    const cacheData = {
      data: value,
      ...(expiresIn ? { expiresIn } : {}),
    };

    this.cache[key] = JSON.stringify(cacheData);
  }

  public async recover<T>(
    key: string,
  ): Promise<{ data: T; expiresIn?: Date } | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as { data: T; expiresIn?: Date };

    if (parsedData.expiresIn && new Date() >= new Date(parsedData.expiresIn)) {
      await this.invalidate(key);
      return null;
    }

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(
    prefix: string,
    _fullPattern?: string,
  ): Promise<void> {
    const keys = Object.keys(this.cache).filter(key => key.startsWith(prefix));

    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
