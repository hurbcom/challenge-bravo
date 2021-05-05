import { Module } from '@nestjs/common';
import { ConvertModule } from './convert/convert.module';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
  imports: [ConvertModule, CurrenciesModule],
})
export class AppModule {}
