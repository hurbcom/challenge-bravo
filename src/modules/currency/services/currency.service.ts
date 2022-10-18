import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CurrencyQuoteDto } from '../../_common/dto/currency-quote.dto';
import { CurrencyRepository } from '../repositories/currency.repository';

@Injectable()
export class CurrencyService {
    constructor(
        @InjectRepository(CurrencyRepository)
        private readonly _currencyRepository: CurrencyRepository
    ) {}

    public async getCurrency() {
        return this._currencyRepository.getCurrencies();
    }

    public async getCurrencyById(id: string) {
        return this._currencyRepository.findOneBy({ id, isActive: true });
    }

    public async getCurrencyByCode(code: string) {
        return this._currencyRepository.findOneBy({ code, isActive: true });
    }

    public async createCurrency(data) {
        return this._currencyRepository.addCurrency(data);
    }

    public async updateCurrency(id: string, data) {
        return this._currencyRepository.updateCurrency(id, data);
    }

    public async deleteCurrency(id: string) {
        return this._currencyRepository.softDeleteById(id);
    }

    public async updateQuotes(quotes: CurrencyQuoteDto[]) {
        return this._currencyRepository.updateCurrencyQuotes(quotes);
    }
}
