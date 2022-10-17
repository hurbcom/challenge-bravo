import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { CurrencyQuoteDto } from '../../modules/_common/dto/currency-quote.dto';

abstract class QuoteAbstract {
    protected _quoteData: CurrencyQuoteDto[] = [];
    protected _cachedQuotes: CurrencyQuoteDto[] = [];
    protected _cacheConfig = {
        ttl: 60,
        key: this.endpoint + '-quotes',
    };

    protected constructor(
        protected readonly http: HttpService,
        private endpoint: string,
        @Inject(CACHE_MANAGER)
        protected readonly _cacheManager?: Cache
    ) {
        this.http.axiosRef.defaults.baseURL = endpoint;
    }

    public async getQuotes(callback?: () => void): Promise<CurrencyQuoteDto[]> {
        await callback?.();
        return this.parseQuotes();
    }

    protected async parseQuotes(callback?: () => void): Promise<CurrencyQuoteDto[]> {
        await callback?.();
        this.cachedQuotes = Promise.resolve(this.quoteData);
        return Promise.resolve(this.cachedQuotes);
    }

    public get quoteData() {
        return this._quoteData;
    }

    public set quoteData(quoteData: CurrencyQuoteDto[]) {
        this._quoteData = quoteData;
    }

    public get cachedQuotes(): Promise<CurrencyQuoteDto[]> {
        if (!this._cacheManager) return Promise.resolve(this.quoteData);
        return (async () => {
            const cachedData = await this._cacheManager.get<CurrencyQuoteDto[]>(this._cacheConfig.key);
            if (!cachedData) return this.quoteData;
            return this._cachedQuotes;
        })();
    }

    public set cachedQuotes(quotes: Promise<CurrencyQuoteDto[]>) {
        if (!this._cacheManager) return;
        const cache = async () => {
            await this._cacheManager.set(this._cacheConfig.key, quotes, { ttl: this._cacheConfig.ttl });
            this._cachedQuotes = await quotes;
        };
        cache();
    }
}

export default QuoteAbstract;
