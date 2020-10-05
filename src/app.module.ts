import { Module } from '@nestjs/common';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [ExchangeModule],
})
export class AppModule {}
