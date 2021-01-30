const CurrenciesModel = require("../models/currenciesModel");
const currencyExchangeService = require("../services/currencyExchangeService");
const currenciesDao = require("../database/currenciesDao");

const BASE_CURRENCY = "USD";
const INITIAL_AVAILABLE_CURRENCIES = ["USD", "BRL", "EUR", "BTC", "ETH"];

const seedDatabase = async () => {
    //Validates whether the database has already been initialized
    const anyCurrency = await currenciesDao.findOne({});
    if (anyCurrency !== null) {
        return;
    }
    const {
        data: { rates },
    } = await currencyExchangeService.getCurrency(BASE_CURRENCY);

    for await (const initialCurrency of INITIAL_AVAILABLE_CURRENCIES){
        const currency = new CurrenciesModel({
            code: initialCurrency,
            rateToBase: rates[initialCurrency],
        });
        await currenciesDao.save(currency);
    }
}
module.exports = {
    seedDatabase,
    BASE_CURRENCY,
    INITIAL_AVAILABLE_CURRENCIES
};
