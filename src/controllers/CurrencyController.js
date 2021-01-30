const sanitize = require('mongo-sanitize');
const Error = require('../interfaces/Error');

class CurrencyController {
    constructor({ currencyService }) {
        this.currencyService = currencyService;
        this.sanitize = sanitize;

        this.listCurrencies = this.listCurrencies.bind(this);
        this.addCurrency = this.addCurrency.bind(this);
        this.removeCurrency = this.removeCurrency.bind(this);
        this.sanitizeCurrencyKey = this.sanitizeCurrencyKey.bind(this);
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
                throw new Error(400, `Currency ${key} available`);
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
            const message = 'Currency is not valid';
            console.error(message);
            throw new Error(400, message);
        }
        return mongoSanitizedBody.toLowerCase();
    }
}

module.exports = CurrencyController;
