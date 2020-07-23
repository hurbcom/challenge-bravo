const ExchangeRatesService = require("../services/exchange-rates-service");
const sanitize = require("mongo-sanitize");
const ErrorMessage = require("../models/error-msg");
const moment = require('moment');
const Configuration = require("../config/config");

class ExchangeController
{
	constructor( container )
	{
		this.exchangeService = container.get(ExchangeRatesService)
	}
	async exchange(req, res)
	{
		try {
			const query = req.query;
			const from = this.sanitizeCurrencyKey(query.from);
			const to = this.sanitizeCurrencyKey(query.to);
			const amount = this.sanitizeAmount(query.amount);
			res.json( await this.exchangeService.exchangeFromTo(from, to, amount));
		} catch (error) {
			return res.status(400).json(new ErrorMessage(400,error.message))
		}
	}
	async latest(req, res)
	{
		const latestRates = await this.exchangeService.getLatestExchangeRates();
		latestRates.referenceDate = moment(latestRates.referenceDate).format(Configuration.DEFAULT_DATE_FORMAT);
		res.json(latestRates);
	}

	sanitizeAmount(amount)
	{
		let mongoSanitizedAmount = sanitize(amount);
		mongoSanitizedAmount = toFixed(mongoSanitizedAmount);
		if( !mongoSanitizedAmount || isNaN(mongoSanitizedAmount))
		{
			throw new Error("No valid amount value in query parameter.");
		}
		return mongoSanitizedAmount;
	}
	sanitizeCurrencyKey(key)
	{
		const mongoSanitizedKey = sanitize(key);
		if( !mongoSanitizedKey || typeof(mongoSanitizedKey) != 'string')
		{
			throw new Error("No valid key in query parameter.");
		}
		return mongoSanitizedKey.toLowerCase();
	}
}
module.exports = ExchangeController;