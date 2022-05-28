import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { CurrencyDto } from './currency.dto';
import { Currency } from './currency.entity';

@Injectable()
export class CurrencyDbService {

    constructor(@Inject('CURRENCY_REPOSITORY') private readonly currencyRepository: typeof Currency) { }

    async upsertCurrency(request: CurrencyDto): Promise<boolean | Currency> {
        try {
            const currencyId = await this.findCurrency(request);
            if (currencyId)
                request.id = currencyId;

            const dbResponse = await this.currencyRepository.upsert(request);
            return _.first(dbResponse)
        } catch (error) {
            console.log(error.message ? error.message : error)
            throw error.message ? error.message : error;
        }
    }

    async findCurrency(request: CurrencyDto): Promise<string> {
        try {
            const databaseResponse = await this.currencyRepository.findOne({ where: { currency: request.currency } });
            return _.get(databaseResponse, 'id');
        } catch (error) {
            console.log(error.message ? error.message : error)
            throw error.message ? error.message : error;
        }
    }
}


