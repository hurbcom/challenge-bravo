import { Module } from '@nestjs/common';
import { ExchangeModule } from './exchange/exchange.module';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
  imports: [ExchangeModule, CurrenciesModule],
})
export class AppModule {}
