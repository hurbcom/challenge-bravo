const CurrencyModel = require('../models/currency')
const { isNullOrEmpty } = require('../utils');

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
        const fromCurrency = currencies.filter(c => c.code == from.toUpperCase())[0];
        const toCurrency = currencies.filter(c => c.code == to.toUpperCase())[0];

        if(isNullOrEmpty(fromCurrency)) {
            return {
                status: 200, data: {
                    status: 'error',
                    message: `${from} not found`
                }
            };
        }

        if(isNullOrEmpty(toCurrency)) {
            return {
                status: 200, data: {
                    status: 'error',
                    message: `${to} not found`
                }
            };
        }

        const fromBID = fromCurrency.bid;
        const toBID = toCurrency.bid;

        const bid = (((1 / toBID) / (1 / fromBID)) * amount).toFixed(2);

        return { status: 200, data: { from, to, amount, bid } };
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
    try {
        await CurrencyModel.removeCurrency(code);
        return { status: 200 };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ removeCurrency ~ error`, error);
        return { status: 500 };
    }
}

module.exports = {
    getAll,
    getByCode,
    conversion,
    newCurrency,
    removeCurrency
}