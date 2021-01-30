const CurrenciesModel = require("../models/currenciesModel");
const configService = require("../services/configService");
const currencyExchangeService = require("../services/currencyExchangeService");
const currenciesDao = require("../database/currenciesDao");

const addCurrency = async (currency) => {
    let responseData;
    try {
        responseData = await currencyExchangeService.getCurrency(
            configService.BASE_CURRENCY
        );
    } catch (error) {
        console.error(error);
        throw Error("Error to get base coin data from Coinbase");
    }

    const rate = responseData.data.rates[currency];

    try {
        const currencyExist = await currenciesDao.find({ code: currency });

        if (currencyExist.length > 0) {
            throw new Error(`Currency ${currency} already registered.`);
        }

        if (rate != null) {
            const currencyToSave = new CurrenciesModel({
                code: currency,
                rateToBase: rate,
            });

            await currenciesDao.save(currencyToSave);

            return `Currency ${currency} successfully registered.`;
        }
        throw new Error(`Currency ${currency} not supported.`);
    } catch (error) {
        console.error(error);
        throw new Error(`Error while registering currency: ${error.message}`);
    }
};

const removeCurrency = async (currency) => {
    try {
        const deletedCurrency = await currenciesDao.findOneAndDelete({
            code: currency,
        });
        if (deletedCurrency == null) {
            throw new Error(`Currency ${currency} is not registered.`);
        }
        return `Currency ${currency} successfully deleted.`;
    } catch (error) {
        throw new Error(`Error while deleting currency: ${error.message}`);
    }
};

module.exports = { addCurrency, removeCurrency };