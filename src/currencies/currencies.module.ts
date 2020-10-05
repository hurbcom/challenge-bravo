import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrenciesController } from './currencies.controller';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';
import { CurrenciesService } from './currencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Currencies, CurrenciesRepository])],
  providers: [CurrenciesService],
  controllers: [CurrenciesController],
  exports: [CurrenciesService],
})
export class CurrenciesModule {}
