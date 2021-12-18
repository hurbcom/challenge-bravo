const CurrencyModel = require('../models/currency')

const getAll = async () => {
    return await CurrencyModel.getAll();
};

const getByCode = async code => {
    return await CurrencyModel.getByCode(code);
};

const conversion = async query => {
    const { from, to, amount } = query;

    const currencies = await CurrencyModel.getAll()
    const fromBID = currencies.filter(c => c.code == from)[0].bid;
    const toBID = currencies.filter(c => c.code == to)[0].bid;

    const calc = (((1 / toBID) / (1 / fromBID)) * amount).toFixed(2);

   return { from, to, amount, calc };
};

const newCurrency = async (code, bid) => {
    return { code, bid };
};

const removeCurrency = async code => {
    return code;
}

module.exports = {
    getAll,
    getByCode,
    conversion,
    newCurrency,
    removeCurrency
}