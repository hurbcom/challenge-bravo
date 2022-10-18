import { Injectable, NotFoundException } from '@nestjs/common';

import { CoinbaseApiService } from '../../../libraries/quote/quote-services/coinbase-api.service';
import { CurrencyService } from '../../currency/services/currency.service';
import { ConversionResponseDto } from '../dto/conversion-response.dto';

@Injectable()
export class ConversionService {
    constructor(
        private readonly _quoteService: CoinbaseApiService,
        private readonly _currencyService: CurrencyService
    ) {}

    public async convert({ from, to, amount }): Promise<ConversionResponseDto | NotFoundException> {
        await this._updatePricesByRealQuotes();
        const [fromCurrency, toCurrency] = await Promise.all([
            this._currencyService.getCurrencyByCode(from.toUpperCase()),
            this._currencyService.getCurrencyByCode(to.toUpperCase()),
        ]);

        if (!fromCurrency || !toCurrency) {
            return new NotFoundException();
        }

        return ConversionResponseDto.parse({ toCurrency, fromCurrency, amount });
    }

    private async _updatePricesByRealQuotes() {
        const quotes = await this._quoteService.getQuotes();
        await this._currencyService.updateQuotes(quotes);
    }
}
