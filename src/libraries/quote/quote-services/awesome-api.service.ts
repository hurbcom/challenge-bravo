import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { CurrencyQuoteDto } from '../../../modules/_common/dto/currency-quote.dto';
import QuoteAbstract from '../quote.abstract';

@Injectable()
export class AwesomeApiService extends QuoteAbstract {
    constructor(
        private readonly _httpService: HttpService,
        @Inject(CACHE_MANAGER)
        protected readonly _cacheManager: Cache
    ) {
        super(_httpService, 'https://economia.awesomeapi.com.br/json', _cacheManager);
    }

    public async getQuotes() {
        return await super.getQuotes(async () => {
            this.quoteData = (await this.http.get('/last/BRL-USD,EUR-USD,BTC-USD,ETH-USD').toPromise()).data;
        });
    }

    protected async parseQuotes(): Promise<CurrencyQuoteDto[]> {
        return await super.parseQuotes(() => {
            this.quoteData = Object.keys(this._quoteData).reduce((acc, curr) => {
                acc.push({
                    code: this._quoteData[curr].code,
                    ratio: this._quoteData[curr].bid,
                });
                return acc;
            }, []);
        });
    }
}
