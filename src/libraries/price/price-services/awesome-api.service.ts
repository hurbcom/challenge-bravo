import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import PriceAbstract from '../price.abstract';

@Injectable()
export class AwesomeApiService extends PriceAbstract {
    endpoint = 'https://economia.awesomeapi.com.br/json';

    constructor(private readonly _httpService: HttpService) {
        super();
    }

    public async getPrices() {
        this.priceData = (
            await this._httpService.get(this.endpoint + '/last/BRL-USD,EUR-USD,BTC-USD,ETH-USD').toPromise()
        ).data;
        this.priceData = Object.keys(this.priceData).reduce((acc, curr) => {
            acc[curr.replace('USD', '')] = this.priceData[curr];
            return acc;
        }, {});
        console.log(this.priceData);
        await super.getPrices();
        return this.priceData;
    }
}
