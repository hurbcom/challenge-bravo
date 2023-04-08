import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Currency, CurrencySchema } from './entities/currency.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            { name: Currency.name, schema: CurrencySchema },
        ]),
    ],
    controllers: [CurrencyController],
    providers: [CurrencyService],
})
export class CurrencyModule {}
