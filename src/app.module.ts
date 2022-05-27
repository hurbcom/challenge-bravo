import { Module } from '@nestjs/common';
import { CurrencyModule } from './app/currency/currency.module';
import { ExchangeModule } from './app/exchange/exchange.module';
import { ExchangeHttpModule } from './core/exchange-http/exchange-http.module';

@Module({
  imports: [CurrencyModule, ExchangeModule, ExchangeHttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
