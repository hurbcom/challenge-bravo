import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CurrencyModule } from './modules/currency/currency.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
        MongooseModule.forRoot('mongodb://localhost/:27017'), //TODO using env here
        CurrencyModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
