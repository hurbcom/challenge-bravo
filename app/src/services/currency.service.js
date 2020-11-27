import currencyDao from '../dao/currency.dao';
import { Conflict, NotFound } from '../api/middlewares/error/model/HttpError';
import CurrencyDao from '../dao/currency.dao';

export default class CurrencyService {

    constructor(currencyDao) {
        this.currencyDao = currencyDao || new CurrencyDao();
    }

    async save(currency) {
        const foundCurrency = await this.currencyDao.findByName(currency);

        if (foundCurrency) {
            throw new Conflict('Currency already exists.')
        }

        await this.currencyDao.save(currency);
    }

    async remove(currency) {
        const foundCurrency = await this.currencyDao.findByName(currency);

        if (!foundCurrency) {
            throw new NotFound(`${currency} not found.`);
        }

        const deleteCount = await this.currencyDao.remove(currency);
        
        if (deleteCount !== 1) {
            throw new Error('Failed to delete.');
        }
    }

    async findOne(currency) {
        const foundCurrency = await this.currencyDao.findByName(currency);

        if (!foundCurrency) {
            throw new NotFound(`${currency} not found.`);
        }

        return foundCurrency;
    }

    async getAll() { 
        return await this.currencyDao.getAll() 
    }
}