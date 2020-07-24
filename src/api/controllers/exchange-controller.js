const sanitize = require('mongo-sanitize');
const ExchangeRatesService = require('../../services/exchange-rates-service');
const ErrorMessage = require('../../models/dtos/error-msg');

class ExchangeController {
    constructor(container) {
        this.sanitize = sanitize;
        this.exchangeService = container.get(ExchangeRatesService);
    }

    async exchange(req, res) {
        try {
            const { query } = req;
            const from = this.sanitizeCurrencyKey(query.from);
            const to = this.sanitizeCurrencyKey(query.to);
            const amount = this.sanitizeAmount(query.amount);
            return res.json(await this.exchangeService.exchangeFromTo(from, to, amount));
        } catch (error) {
            const status = error.status || 500;
            return res.status(status).json(new ErrorMessage(status, error.message));
        }
    }

    async latest(req, res) {
        const latestRates = await this.exchangeService.getLatestExchangeRates();
        res.json(latestRates);
    }

    sanitizeAmount(amount) {
        let mongoSanitizedAmount = this.sanitize(amount);
        mongoSanitizedAmount = parseFloat(mongoSanitizedAmount);
        if (!mongoSanitizedAmount || Number.isNaN(mongoSanitizedAmount)) {
            throw new ErrorMessage(400, 'No valid amount value in query parameter.');
        }
        return mongoSanitizedAmount;
    }

    sanitizeCurrencyKey(key) {
        const mongoSanitizedKey = this.sanitize(key);
        if (!mongoSanitizedKey || typeof mongoSanitizedKey !== 'string') {
            throw new ErrorMessage(400, 'No valid key in query parameter.');
        }
        return mongoSanitizedKey.toLowerCase();
    }
}
module.exports = ExchangeController;
