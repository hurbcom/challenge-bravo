const sanitize = require('mongo-sanitize');
const Error = require('../interfaces/Error');
const CurrencyService = require('../services/CurrencyService');

class CurrencyController {
    constructor() {
        this.currencyService = CurrencyService;
        this.sanitize = sanitize;
    }

    async listCurrencies(req, res) {
        const currencyList = await this.currencyService.listCurrencies();
        res.json(currencyList);
    }

    async addCurrency(req, res) {
        try {
            const key = this.sanitizeCurrencyKey(req.body.key);

            const existingKey = await this.currencyService.getCurrency(key);
            if (existingKey) {
                throw new Error(400, `Key ${key} is already available`);
            }

            const newCurrency = await this.currencyService.addCurrency(key);
            return res.status(201).json(newCurrency);
        } catch (error) {
            const status = error.status || 500;
            console.error(error.message);
            return res.status(status).json(new Error(status, error.message));
        }
    }

    async removeCurrency(req, res) {
        try {
            const key = this.sanitizeCurrencyKey(req.params.key);
            await this.currencyService.removeCurrency(key);
            return res.status(204).json();
        } catch (error) {
            const status = error.status || 500;
            console.error(error.message);
            return res.status(status).json(new Error(status, error.message));
        }
    }

    sanitizeCurrencyKey(key) {
        const mongoSanitizedBody = this.sanitize(key);
        if (!mongoSanitizedBody || typeof mongoSanitizedBody !== 'string') {
            const message = 'No valid key in body';
            console.error(message);
            throw new Error(400, message);
        }
        return mongoSanitizedBody.toLowerCase();
    }
}

module.exports = new CurrencyController();