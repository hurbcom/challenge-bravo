import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';
var validateCurrencyCode = require('validate-currency-code');


@Injectable()
export class CurrenciesService {
    constructor(private currenciesRepository: CurrenciesRepository) { }
    async getCurrency(currency: string): Promise<Currencies> {
        try {

            if (!currency || !validateCurrencyCode(currency)) {
                throw new Error('Client requested an unsupported currency');
            }

            return await this.currenciesRepository.getCurrency(currency);
        } catch (error) {

            throw new InternalServerErrorException();

        }

        //
    }

    async createCurrency(currency: string): Promise<Currencies> {

        if (!currency || !validateCurrencyCode(currency)) {
            throw new Error('Client requested create an unsupported currency');
            //throw new Error();
        }
        try {
            return await this.currenciesRepository.createCurrency(currency);
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();

        }

        //
    }

    async deleteCurrency(currency: string): Promise<void> {

        if (!currency || !validateCurrencyCode(currency)) {
            throw new Error('Client requested delete an unsupported currency');
            //throw new Error();
        }
        try {
            return await this.currenciesRepository.deleteCurrency(currency);
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();

        }

        //
    }



}
