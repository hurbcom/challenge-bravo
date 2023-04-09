import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyModule, HealthModule } from './modules';

@Module({
    imports: [
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
        MongooseModule.forRoot(
            `${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
        ), //TODO use asyncForRoot to read env from configModule
        CurrencyModule,
        HealthModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
