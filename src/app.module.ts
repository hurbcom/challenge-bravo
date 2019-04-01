import { Module } from '@nestjs/common';

import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [CurrencyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
