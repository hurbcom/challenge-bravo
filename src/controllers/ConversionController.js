const sanitize = require('mongo-sanitize');
const ConversionService = require('../services/ConversionService');
const Error = require('../interfaces/Error');

class ConversionController {
    constructor() {
        this.sanitize = sanitize;
        this.conversionService = ConversionService;
    }

    async convert(req, res) {
        try {
            const { query } = req;
            const from = this.sanitizeCurrencyKey(query.from);
            const to = this.sanitizeCurrencyKey(query.to);
            const amount = this.sanitizeAmount(query.amount);
            return res.json(await this.conversionService.convertFromTo(from, to, amount));
        } catch (error) {
            const status = error.status || 500;
            console.error(error.message);
            return res.status(status).json(new Error(status, error.message));
        }
    }

    async latest(req, res) {
        const latestRates = await this.conversionService.getLatestConversionRate();
        res.json(latestRates);
    }

    sanitizeAmount(amount) {
        let mongoSanitizedAmount = this.sanitize(amount);
        mongoSanitizedAmount = parseFloat(mongoSanitizedAmount);
        if (!mongoSanitizedAmount || Number.isNaN(mongoSanitizedAmount)) {
            throw new Error(400, 'No valid amount value in query parameter.');
        }
        return mongoSanitizedAmount;
    }

    sanitizeCurrencyKey(key) {
        const mongoSanitizedKey = this.sanitize(key);
        if (!mongoSanitizedKey) {
            const message = `No valid key '${key}' in query parameter.`;
            console.error(message);
            throw new Error(400, message);
        }
        return mongoSanitizedKey.toLowerCase();
    }
}

module.exports = new ConversionController();