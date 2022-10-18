import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { redisConfig } from './config/redis.config';
import { PostgresService } from './database/services/postgres/postgres.service';
import { QuoteModule } from './libraries/quote/quote.module';
import { ConversionModule } from './modules/conversion/conversion.module';
import { CurrencyModule } from './modules/currency/currency.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CacheModule.register(redisConfig()),
        TypeOrmModule.forRootAsync({ useClass: PostgresService, inject: [PostgresService] }),
        ConversionModule,
        CurrencyModule,
        QuoteModule,
    ],
})
export class AppModule {}
