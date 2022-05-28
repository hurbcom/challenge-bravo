import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';
import { CurrencyDto } from './currency.dto';
import { Currency } from './currency.entity';

@Injectable()
export class CurrencyDbService {

    constructor(@Inject('CURRENCY_REPOSITORY') private readonly currencyRepository: typeof Currency) { }

    async upsertCurrency(request: CurrencyDto): Promise<boolean | Currency> {
        try {
            const currencyObj = await this.findCurrency(request.currency);
            if (currencyObj)
                request.id = currencyObj.id;
            console.log(request)
            const dbResponse = await this.currencyRepository.upsert(request);
            return _.first(dbResponse)
        } catch (error) {
            console.log(error.message ? error.message : error)
            throw error.message ? error.message : error;
        }
    }

    async findCurrency(currency: string): Promise<Currency> {
        try {
            return await this.currencyRepository.findOne({ where: { currency: currency } });
        } catch (error) {
            console.log(error.message ? error.message : error)
            throw error.message ? error.message : error;
        }
    }

    async removeCurrency(currency: string) {
        try {
            const currencyObj = await this.findCurrency(currency);
            if (currencyObj) {
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


