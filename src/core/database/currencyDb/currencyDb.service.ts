import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { CurrencyDto } from './currency.dto';
import { Currency } from './currency.entity';

@Injectable()
export class CurrencyDbService {

    constructor(@Inject('CURRENCY_REPOSITORY') private readonly currencyRepository: typeof Currency) { }

    async upsertCurrency(request: CurrencyDto) {
        try {
            const searchUser = await this.findCurrencies(request);
            let returnMsg = 'Usuário criado.';
            if (searchUser !== false) {
                request.id = searchUser;
                returnMsg = 'Usuário atualizado.';
            }
            const registeredUser = await this.currencyRepository.upsert(request);
            if (registeredUser) {
                return registeredUser;
            }
        } catch (error) {
            console.log(error.message ? error.message : error)
            throw error.message ? error.message : error;
        }
    }

    async findCurrencies(request: CurrencyDto) {
        try {
            const databaseResponse = await this.currencyRepository.findOne({ where: { currency: request.currency } });
            if (databaseResponse) {
                return _.get(databaseResponse, 'id');
            }
            return false;
        } catch (error) {
            console.log(error.message ? error.message : error)
            throw error.message ? error.message : error;
        }
    }
}


