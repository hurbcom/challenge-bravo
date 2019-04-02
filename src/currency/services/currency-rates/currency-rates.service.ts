import * as NodeCache from 'node-cache';
import { Cacheable, useNodeCacheAdapter } from 'type-cacheable';
import { Interval, NestSchedule } from '@nestcloud/schedule';
import { HttpService, Injectable } from '@nestjs/common';

import { ICurrencyRatesList } from '../../definitions/currency';
import { RatesTransformer } from '../../transformers/rates/rates.transformer';

const userClient = new NodeCache();
useNodeCacheAdapter(userClient);

@Injectable()
export class CurrencyRatesService extends NestSchedule {
    readonly externalApiRatesUrl = 'https://api.coincap.io/v2/rates';

    constructor(private readonly httpService: HttpService) {
        super();
    }

    @Cacheable({
        cacheKey: 'rates',
        client: userClient as any,
        ttlSeconds: 0,
    })
    async getRates(): Promise<ICurrencyRatesList> {
        return this.getRatesWithoutCache();
    }

    async getRatesWithoutCache() {
        const {
            data: { data },
        } = await this.httpService.get(this.externalApiRatesUrl).toPromise();

        const transformedRates = RatesTransformer.transform(data);

        return transformedRates;
    }

    @Interval(60000 * 20)
    async syncRates() {
        userClient.set('rates', this.getRatesWithoutCache());
    }
}
