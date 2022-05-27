import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { ExchangeHttpModule } from '../../core/exchange-http/exchange-http.module'

@Module({
  imports: [ExchangeHttpModule],
  controllers: [ExchangeController],
  providers: [ExchangeService]
})
export class ExchangeModule { }
