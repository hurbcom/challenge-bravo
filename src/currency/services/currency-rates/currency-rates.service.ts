import { Cache, ExpirationStrategy, MemoryStorage } from 'node-ts-cache';
import { HttpService, Injectable } from '@nestjs/common';

import { ICurrencyRatesList } from '../../definitions/currency';
import { RatesTransformer } from '../../transformers/rates.transformer';

@Injectable()
export class CurrencyRatesService {
    readonly externalApiRatesUrl = 'https://api.coincap.io/v2/rates';

    constructor(private readonly httpService: HttpService) {}

    @Cache(new ExpirationStrategy(new MemoryStorage()), {
        ttl: 3600,
    })
    async getRates(): Promise<ICurrencyRatesList> {
        const {
            data: { data },
        } = await this.httpService.get(this.externalApiRatesUrl).toPromise();

        return RatesTransformer.transform(data);
    }
}
