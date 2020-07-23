
const CurrencyDao = require("../dao/currency-dao");
const HistoricalRatesDao = require("../dao/historical-rates-dao");
let ExchangeRates = require("../models/exchange-rates");
const ICoinService = require("./coin-service-interface");

class ExchangeRatesService
{
	constructor(container)
	{
		this.coinService = container.get(ICoinService);
		this.historicalRatesDao = container.get(HistoricalRatesDao);
		this.currencyDao = container.get(CurrencyDao);
	}

	async getLatestExchangeRates()
	{
		return await this.historicalRatesDao.getLatest();
	}

	async exchangeFromTo(from, to, amount)
	{
		const latestRate = await this.historicalRatesDao.getLatest();
		console.log(latestRate);
		const fromRate = latestRate[from];
		const toRate = latestRate[to];
		if(fromRate && toRate)
		{
			return (toRate*amount)/fromRate;
		}
		throw Error(`No support provided to given currency keys: from ${from} to: ${to}`)
	}

	async getExchangeRates()
	{
		const exchangeRates = await this.coinService.getAll();
		const availableCurrencies = await this.currencyDao.list();
		let referenceValue = exchangeRates.usd.value;
		let updatedExchangeRates = new ExchangeRates();
		for (const index in availableCurrencies) {
			const currencyKey = availableCurrencies[index].key;
			updatedExchangeRates[currencyKey] = exchangeRates[currencyKey].value/referenceValue;
		}
		await this.historicalRatesDao.insert(updatedExchangeRates);
		return updatedExchangeRates;
	}
}
module.exports = ExchangeRatesService;