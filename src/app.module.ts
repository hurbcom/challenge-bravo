import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CurrencyModule } from './modules/currency/currency.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
    imports: [
        CurrencyModule,
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    ],
    controllers: [AppController],
})
export class AppModule {}
