const CoinGecko = require('coingecko-api');

class CoinGeckoService {
    constructor() {
        this.coinService = new CoinGecko();
    }

    async getAll() {
        try {
            const coinGeckApiResponse = await this.coinService.exchangeRates.all();
            return coinGeckApiResponse.data.rates;
        } catch (error) {
            console.error(error);
        }
        return {};
    }
}

module.exports = CoinGeckoService;
