const axios = require('axios');

const cache = require('../infrastructure/redis');

const { EXCHANGE_RATE_BASE_URL, EXCHANGE_RATE_TOKEN } = process.env;

class ExchangeRate {
    constructor() {
        this.api = axios.create({ baseURL: EXCHANGE_RATE_BASE_URL });
    }

    async latestUSD() {
        const cached = await cache.get('conversion_rates');
        if (cached) return cached;

        const { data } = await this.api.get(`${ EXCHANGE_RATE_TOKEN }/latest/USD`);
        const response = {
            rates: data.conversion_rates,
        };
        cache.set('conversion_rates', response, 60 * 60 * 6);
        return response;
    }
}

module.exports = new ExchangeRate();