import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';

@Module({
  providers: [ExchangeService]
})
export class ExchangeModule {}
