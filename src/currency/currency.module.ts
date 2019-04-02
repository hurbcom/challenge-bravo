import { HttpModule, Module, OnModuleInit } from '@nestjs/common';

import { ConverterController } from './controllers/converter/converter.controller';
import { CurrencyConverterService } from './services/currency-converter/currency-converter.service';
import { CurrencyRatesService } from './services/currency-rates/currency-rates.service';

@Module({
    controllers: [ConverterController],
    imports: [HttpModule],
    providers: [
        CurrencyRatesService,
        {
            provide: 'currencyConverter',
            useFactory: (currencyRatesService: CurrencyRatesService) =>
                new CurrencyConverterService(currencyRatesService),
            inject: [CurrencyRatesService],
        },
    ],
})
export class CurrencyModule implements OnModuleInit {
    constructor(private currencyRatesService: CurrencyRatesService) {}

    async onModuleInit(): Promise<void> {
        await this.currencyRatesService.syncRates();
    }
}
