import { HttpService, Injectable } from '@nestjs/common';

import { ICurrencyRatesList } from '../../definitions/currency';
import { RatesTransformer } from '../../transformers/rates.transformer';

@Injectable()
export class CurrencyRatesService {
    readonly externalApiRatesUrl = 'https://api.coincap.io/v2/rates';

    constructor(private readonly httpService: HttpService) {}

    async getRates(): Promise<ICurrencyRatesList> {
        const {
            data: { data },
        } = await this.httpService.get(this.externalApiRatesUrl).toPromise();

        return RatesTransformer.transform(data);
    }
}
