let CoinGecko = require("coingecko-api");
const exchangeRatesDao = require("../dao/historical-rates-dao");
let ExchangeRates = require("../models/exchange-rates")

class ExchangeRatesService
{
	CoinGeckoClient = new CoinGecko();
	constructor()
	{
		this.dao = new exchangeRatesDao();
	}

	async getLatestExchangeRates()
	{
		return await this.dao.getLatest();
	}

	async getExchangeRates()
	{
		let exchangeRates = await this.CoinGeckoClient.exchangeRates.all();
		let usdValue = exchangeRates.data.rates.usd.value;
		let brl = exchangeRates.data.rates.brl.value/usdValue;
		let eur = exchangeRates.data.rates.eur.value/usdValue;
		let btc = exchangeRates.data.rates.btc.value/usdValue;
		let eth = exchangeRates.data.rates.eth.value/usdValue;
		let updatedExchangeRates = new ExchangeRates(btc,brl,eth,eur);
		await this.dao.insert(updatedExchangeRates);
		return updatedExchangeRates;
	}
}

const instance = new ExchangeRatesService();
module.exports = instance;