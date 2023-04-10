import { Module, OnModuleInit } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Currency, CurrencySchema } from './entities/currency.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            { name: Currency.name, schema: CurrencySchema },
        ]),
    ],
    controllers: [CurrencyController],
    providers: [CurrencyService],
    exports: [CurrencyService],
})
export class CurrencyModule implements OnModuleInit {
    constructor(
        private currencyService: CurrencyService,
        private configService: ConfigService,
    ) {}

    onModuleInit() {
        const supportCode = this.configService.get('supportCode');
        this.currencyService.syncFiatQuotations(supportCode);
        this.currencyService.syncCryptoQuotations(supportCode);
    }
}
