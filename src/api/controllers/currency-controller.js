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
            return res.json(newCurrency);
        } catch (error) {
            return res.status(400).json(new ErrorMessage(400, error.message));
        }
    }

    async removeCurrency(req, res) {
        try {
            const key = this.sanitizeCurrencyKey(req.params.key);
            await this.currencyService.removeCurrency(key);
            return res.status(200).json();
        } catch (error) {
            return res.status(400).json(new ErrorMessage(400, error.message));
        }
    }

    sanitizeCurrencyKey(key) {
        const mongoSanitizedBody = this.sanitize(key);
        if (!mongoSanitizedBody || typeof mongoSanitizedBody !== 'string') {
            throw new Error('No valid key in body');
        }
        return mongoSanitizedBody.toLowerCase();
    }
}
module.exports = CurrencyController;
