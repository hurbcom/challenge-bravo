import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';
import { CurrencyDto } from './currency.dto';
import { Currency } from './currency.entity';

@Injectable()
export class CurrencyDbService {

    constructor(@Inject('CURRENCY_REPOSITORY') private readonly currencyRepository: typeof Currency) { }

    async upsertCurrency(request: CurrencyDto): Promise<boolean | Currency> {
        try {
            const currencyId = await this.findCurrency(request.currency);
            if (currencyId)
                request.id = currencyId;

            const dbResponse = await this.currencyRepository.upsert(request);
            return _.first(dbResponse)
        } catch (error) {
            console.log(error.message ? error.message : error)
            throw error.message ? error.message : error;
        }
    }

    async findCurrency(currency: string): Promise<string> {
        try {
            const dbResponse = await this.currencyRepository.findOne({ where: { currency: currency } });
            return _.get(dbResponse, 'id');
        } catch (error) {
            console.log(error.message ? error.message : error)
            throw error.message ? error.message : error;
        }
    }

    async removeCurrency(currency: string) {
        try {
            const currencyId = await this.findCurrency(currency);
            if (currencyId) {
                const dbResponse = await this.currencyRepository.destroy({ where: { currency: currency } });
                if (dbResponse > 0) return { statusCode: 200, message: `${currency} deleted.` }
            }
            throw new NotFoundException(`Currncy ${currency} not found.`)
        } catch (error) {
            console.log(JSON.stringify(error))
            throw error.message && !error.status ? error.message : error;
        }
    }
}


