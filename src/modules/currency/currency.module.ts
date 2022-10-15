import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyController } from './controllers/currency.controller';
import { CurrencyEntity } from './entities/currency.entity';
import { CurrencyRepository } from './repositories/currency.repository';
import { CurrencyService } from './services/currency.service';

@Module({
    imports: [TypeOrmModule.forFeature([CurrencyEntity])],
    controllers: [CurrencyController],
    providers: [CurrencyService, CurrencyRepository],
    exports: [TypeOrmModule],
})
export class CurrencyModule {}
