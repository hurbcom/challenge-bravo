import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';

@Module({
  providers: [CurrenciesService],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
