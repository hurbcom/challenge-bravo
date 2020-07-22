
const HistoricalRatesDao = require("../dao/historical-rates-dao");
let ExchangeRates = require("../models/exchange-rates");
const ICoinService = require("./coin-service-interface");

class ExchangeRatesService
{
	constructor(container)
	{
		this.coinService = container.get(ICoinService);
		this.dao = container.get(HistoricalRatesDao);
	}

	async getLatestExchangeRates()
	{
		return await this.dao.getLatest();
	}

	async getExchangeRates()
	{
		let exchangeRates = await this.coinService.getAll();
		let usdValue = exchangeRates.usd.value;
		let brl = exchangeRates.brl.value/usdValue;
		let eur = exchangeRates.eur.value/usdValue;
		let btc = exchangeRates.btc.value/usdValue;
		let eth = exchangeRates.eth.value/usdValue;
		let updatedExchangeRates = new ExchangeRates(btc,brl,eth,eur);
		await this.dao.insert(updatedExchangeRates);
		return updatedExchangeRates;
	}
}
module.exports = ExchangeRatesService;