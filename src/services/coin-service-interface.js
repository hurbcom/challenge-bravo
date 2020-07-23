const CoinGecko = require('coingecko-api');

class ICoinService
{
	constructor(container)
	{
		this.coinService = container.get(CoinGecko)
	}
	async getAll()
	{
		const coinGeckApiResponse = await this.coinService.exchangeRates.all();
		return coinGeckApiResponse.data.rates;
	}
}

module.exports = ICoinService;