import { Module } from '@nestjs/common';
import { CurrencyDbService } from './currencyDB.service';
import { currenciesProviders } from './currency.providers';

@Module({
  providers: [CurrencyDbService, ...currenciesProviders],
  exports: [CurrencyDbService],
})
export class CurrencyDbModule {}