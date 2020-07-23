const moment = require('moment');
const Configuration = require("../config/config");
const CurrencyDao = require("../dao/currency-dao");
const HistoricalRatesDao = require("../dao/historical-rates-dao");
let ExchangeRates = require("../models/exchange-rates");
const ExchangeResult = require("../models/exchange-result");
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
		const latestRates = await this.historicalRatesDao.getLatest();
		latestRates.referenceDate = moment(latestRates.referenceDate).format(Configuration.DEFAULT_DATE_FORMAT);
		return latestRates;
	}

	async exchangeFromTo(from, to, amount)
	{
		const latestRate = await this.historicalRatesDao.getLatest();
		console.log(latestRate);
		const fromRate = latestRate[from];
		const toRate = latestRate[to];
		if(fromRate && toRate)
		{
			const result = new ExchangeResult();
			result.from = from;
			result.to = to;
			result.amount = amount;
			result.value = (toRate*amount)/fromRate;
			result.timestamp = moment().format(Configuration.DEFAULT_DATE_FORMAT);
			return result;
		}
		throw Error(`No support provided to given currency from: ${from} to: ${to}`)
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