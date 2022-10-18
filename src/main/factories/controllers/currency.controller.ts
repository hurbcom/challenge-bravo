import { PrismaClient } from '@prisma/client';
import { CurrencyService } from '../../../domain/currency/services/currency.service';
import { RedisCurrency } from '../../../infrastructure/cache/redis/currency/redis-currency';
import { redisClient } from '../../../infrastructure/cache/redis/redis';
import { MongoCurrencyRepository } from '../../../infrastructure/database/mongodb/repositories/currency/currency.repository';
import { AwesomeCurrencyAPI } from '../../../infrastructure/external-currency/external-currency-api';
import { CurrencyController } from '../../controllers/currency.controller';

export class CurrencyControllerFactory {
  static create(){
    const prismaClient = new PrismaClient();
    const currencyRepository = new MongoCurrencyRepository(prismaClient);
    const externalCurrencyApi = new AwesomeCurrencyAPI();
    const currencyCacheManager = new RedisCurrency(redisClient);
    const currencyService = new CurrencyService(currencyRepository, externalCurrencyApi, currencyCacheManager);
    return new CurrencyController(currencyService);
  }
}