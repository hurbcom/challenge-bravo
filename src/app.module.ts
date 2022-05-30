import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CurrencyModule } from './app/currency/currency.module';
import { ExchangeModule } from './app/exchange/exchange.module';
import { DatabaseModule } from './core/database/database.module';
import { ExchangeHttpModule } from './core/exchange-http/exchange-http.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CurrencyModule,
    ExchangeModule,
    ExchangeHttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
