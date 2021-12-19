const CurrencyModel = require('../models/currency')

const getAll = async () => {
    try {
        const data = await CurrencyModel.getAll();
        return { status: 200, data };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ getAll ~ error`, error);
        return { status: 500 };
    }
};

const getByCode = async code => {
    try {
        const data = await CurrencyModel.getByCode(code);
        return { status: 200, data };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ getByCode ~ error`, error);
        return { status: 500 };
    }
};

const conversion = async query => {
    try {
        const { from, to, amount } = query;

        const currencies = await CurrencyModel.getAll()
        const fromBID = currencies.filter(c => c.code == from)[0].bid;
        const toBID = currencies.filter(c => c.code == to)[0].bid;

        const calc = (((1 / toBID) / (1 / fromBID)) * amount);

        return { status: 200, data: { from, to, amount, calc } };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ conversion ~ error`, error);
        return { status: 500 };
    }

};

const newCurrency = async (code, bid) => {
    try {
        await CurrencyModel.newCurrency(code, bid);
        return { status: 201 };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ newCurrency ~ error`, error);
        return { status: 500 };
    }
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