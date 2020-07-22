const CurrencyDao = require("../dao/currency-dao");
const Currency = require("../models/currency");
const ICoinService = require("./coin-service-interface");

class CurrencyService
{
	constructor(container)
	{
		this.dao = container.get(CurrencyDao);
		this.coinService =  container.get(ICoinService)
	}

	async listCurrencies()
	{
		const currentCurrencies = await this.dao.list();
		return currentCurrencies;
	}
	async addCurrency(newKey)
	{
		const availableCoins = await this.coinService.getAll();
		const availableCoin = availableCoins[newKey];
		if(availableCoin)
		{
			const hasKey = await this.dao.findByKey(newKey);
			if(hasKey)
			{
				throw new Error(`Key ${newKey} is already available`);
			}
			const newCurrency = new Currency(newKey, availableCoin.name, availableCoin.unit, availableCoin.type);
			this.dao.insert(newCurrency);
			return newCurrency;
		}
		throw new Error(`No support for given currency key: ${newKey}`);
	}
	async removeCurrency(key)
	{
		const hasKey = await this.dao.findByKey(key);
		if(hasKey)
		{
			return await this.dao.delete(key);
		}
		throw new Error(`No currency found with given key: ${key}`);

	}
}
module.exports = CurrencyService;