import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { CurrencyDbModule } from 'src/core/database/currencyDb/currencyDb.module';
import { ExchangeHttpModule } from 'src/core/exchange-http/exchange-http.module';

@Module({
  imports: [CurrencyDbModule, ExchangeHttpModule],
  controllers: [CurrencyController],
  providers: [CurrencyService]
})
export class CurrencyModule { }
