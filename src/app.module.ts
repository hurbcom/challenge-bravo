import { Module } from '@nestjs/common';
import { CurrencyModule } from './app/currency/currency.module';
import { ExchangeModule } from './app/exchange/exchange.module';

@Module({
  imports: [CurrencyModule, ExchangeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
