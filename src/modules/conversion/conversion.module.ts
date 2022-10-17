import { Module } from '@nestjs/common';

import { CoinbaseApiService } from '../../libraries/quote/quote-services/coinbase-api.service';
import { QuoteModule } from '../../libraries/quote/quote.module';
import { CurrencyModule } from '../currency/currency.module';

import { ConversionController } from './controllers/conversion.controller';
import { ConversionService } from './services/conversion.service';

@Module({
    imports: [CurrencyModule, QuoteModule],
    providers: [ConversionService, CoinbaseApiService],
    controllers: [ConversionController],
})
export class ConversionModule {}
