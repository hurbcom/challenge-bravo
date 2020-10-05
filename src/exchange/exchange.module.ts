import { Module } from '@nestjs/common';
import { CurrenciesModule } from 'src/currencies/currencies.module';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [CurrenciesModule],
  providers: [ExchangeService],
  controllers: [ExchangeController],
  exports: [ExchangeService],
})
export class ExchangeModule {}
