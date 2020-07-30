const CoinGecko = require('coingecko-api');

class ICoinService {
    constructor(container) {
        this.coinService = container.get(CoinGecko);
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

module.exports = ICoinService;
