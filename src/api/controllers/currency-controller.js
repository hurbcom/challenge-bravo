const sanitize = require('mongo-sanitize');
const ErrorMessage = require('../../models/dtos/error-msg');
const CurrencyService = require('../../services/currency-service');

class CurrencyController {
    constructor(container) {
        this.currencyService = container.get(CurrencyService);
        this.sanitize = sanitize;
    }

    async list(req, res) {
        const currencyList = await this.currencyService.listCurrencies();
        res.json(currencyList);
    }

    async addCurrency(req, res) {
        try {
            const key = this.sanitizeCurrencyKey(req.body.key);
            const newCurrency = await this.currencyService.addCurrency(key);
            return res.status(201).json(newCurrency);
        } catch (error) {
            const status = error.status || 500;
            return res.status(status).json(new ErrorMessage(status, error.message));
        }
    }

    async removeCurrency(req, res) {
        try {
            const key = this.sanitizeCurrencyKey(req.params.key);
            await this.currencyService.removeCurrency(key);
            return res.status(204).json();
        } catch (error) {
            const status = error.status || 500;
            return res.status(status).json(new ErrorMessage(status, error.message));
        }
    }

    sanitizeCurrencyKey(key) {
        const mongoSanitizedBody = this.sanitize(key);
        if (!mongoSanitizedBody || typeof mongoSanitizedBody !== 'string') {
            throw new ErrorMessage(400, 'No valid key in body');
        }
        return mongoSanitizedBody.toLowerCase();
    }
}
module.exports = CurrencyController;
