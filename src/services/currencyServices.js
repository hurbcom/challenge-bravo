const currencyRepository = require("../repository/currencyRepository");
const CurrencyNotFoundError = require("../error/types/currencyNotFoundError");

const getCurrencies = async () => {
    return await currencyRepository.find();
};

const getCurrency = async (symbol) => {
    let storedCurrency = await currencyRepository.findOne(symbol);
    if (!storedCurrency) throw new CurrencyNotFoundError();
    return storedCurrency;
};

const createCurrency = async (currency) => {
    let storedCurrency = await currencyRepository.findOne(currency.symbol);
    if (!storedCurrency) {
        storedCurrency = await currencyRepository.store(currency);
    }
    return storedCurrency;
};

const removeCurrency = async (symbol) => {
    let storedCurrency = await currencyRepository.findOne(symbol);
    if (!storedCurrency) throw new CurrencyNotFoundError();
    return currencyRepository.remove(symbol);
};

module.exports = {
    getCurrencies,
    getCurrency,
    createCurrency,
    removeCurrency,
};
