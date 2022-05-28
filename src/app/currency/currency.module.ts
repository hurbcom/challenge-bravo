import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { CurrencyDbModule } from 'src/core/database/currencyDb/currencyDb.module';

@Module({
  imports: [CurrencyDbModule],
  controllers: [CurrencyController],
  providers: [CurrencyService]
})
export class CurrencyModule { }
