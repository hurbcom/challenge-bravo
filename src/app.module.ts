import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { redisConfig } from './config/redis.config';
import { PostgresService } from './database/services/postgres/postgres.service';
import { ConversionModule } from './modules/conversion/conversion.module';
import { CurrencyModule } from './modules/currency/currency.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({ useClass: PostgresService, inject: [PostgresService] }),
        CacheModule.register(redisConfig()),
        ConversionModule,
        CurrencyModule,
    ],
})
export class AppModule {}
