import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';

@Module({
  controllers: [ExchangeController],
  providers: [ExchangeService]
})
export class ExchangeModule {}
