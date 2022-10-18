import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { CurrencyQuoteDto } from '../../../modules/_common/dto/currency-quote.dto';
import QuoteAbstract from '../quote.abstract';

export class CoinbaseApiService extends QuoteAbstract {
    constructor(
        private readonly _httpService: HttpService,
        @Inject(CACHE_MANAGER)
        protected readonly _cacheManager: Cache
    ) {
        super(_httpService, 'https://api.coinbase.com/v2', _cacheManager);
    }

    public async getQuotes() {
        return await super.getQuotes(async () => {
            const response: any = (await this.http.get('/exchange-rates?currency=USD').toPromise()).data;
            this.quoteData = response.data?.rates || {};
        });
    }

    protected async parseQuotes(): Promise<CurrencyQuoteDto[]> {
        return await super.parseQuotes(() => {
            this.quoteData = Object.keys(this.quoteData).reduce((acc, curr) => {
                acc.push({
                    code: curr,
                    ratio: this.quoteData[curr],
                });
                return acc;
            }, []);
        });
    }
}
