import { PrismaClient } from '@prisma/client';
import { CurrencyService } from '../../../domain/currency/services/currency.service';
import { MongoCurrencyRepository } from '../../../infrastructure/database/mongodb/repositories/currency/currency.repository';
import { AwesomeCurrencyAPI } from '../../../infrastructure/external-currency/external-currency-api';
import { CurrencyController } from '../../controllers/currency.controller';

export class CurrencyControllerFactory {
  static create(){
    const prismaClient = new PrismaClient();
    const currencyRepository = new MongoCurrencyRepository(prismaClient);
    const externalCurrencyApi = new AwesomeCurrencyAPI();
    const currencyService = new CurrencyService(currencyRepository, externalCurrencyApi);
    return new CurrencyController(currencyService);
  }
}