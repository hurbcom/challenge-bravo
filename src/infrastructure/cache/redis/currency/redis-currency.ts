import Redis from 'ioredis';
import { Currency } from '../../../../domain/currency/entities/currency.entity';
import { CurrencyCacheManager } from '../../../../domain/currency/services/currency-cache-manager.service';

export class RedisCurrency implements CurrencyCacheManager {
  constructor(private readonly redisClient: Redis){}
  async getCache(key: string): Promise<Currency | null> {
    const redisGet = await this.redisClient.get(key);
    if(!redisGet) return null;
    const cached = JSON.parse(redisGet);
    return new Currency(
      cached._code,
      cached._unitCost,
      cached._backingCurrency,
      cached._id
    );
  }
  async setCache(key: string, value: Currency): Promise<string> {
    const redisSet = await this.redisClient.set(key, JSON.stringify(value), 'EX', 30);
    return redisSet;
  }
}