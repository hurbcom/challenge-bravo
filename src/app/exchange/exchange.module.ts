import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { ExchangeHttpModule } from '../../core/exchange-http/exchange-http.module'
import { CurrencyDbModule } from 'src/core/database/currencyDb/currencyDb.module';

@Module({
  imports: [ExchangeHttpModule, CurrencyDbModule],
  controllers: [ExchangeController],
  providers: [ExchangeService]
})
export class ExchangeModule { }
