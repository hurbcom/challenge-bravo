import { Injectable, InternalServerErrorException } from '@nestjs/common';
var validateCurrencyCode = require('validate-currency-code');

export class Currencies {
    currency: string;
    value: number;
    currentRate: number;
}

export class CurrenciesRepository {
    async getCurrency(currency: string): Promise<Currencies> {
        return new Currencies();
    }

    async createCurrency(currency: string): Promise<Currencies> {
        return new Currencies();
    }
}

@Injectable()
export class CurrenciesService {
    constructor(private currenciesRepository: CurrenciesRepository) { }
    async getCurrency(currency: string): Promise<any> {
        try {

            if (!currency || !validateCurrencyCode(currency)) {
                throw new Error('Client requested create an unsupported currency');
            }

            return await this.currenciesRepository.getCurrency(currency);
        } catch (error) {

            throw new InternalServerErrorException();

        }

        //
    }

    async createCurrency(currency: string): Promise<any> {

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

}
