const CurrencyModel = require('../models/currency')
const { isNullOrEmpty, formatCurrency } = require('../utils');
const { setCache, getCache } = require('../services/redis');

const getAll = async () => {
    try {
        let data = [];
        const dataCache = await getCache('ALL_CURRENCIES');
        if (dataCache) {
            data = dataCache;
        } else {
            data = await CurrencyModel.getAll();
        }

        return { status: 200, data };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ getAll ~ error`, error);
        return { status: 500 };
    }
};

const getByCode = async code => {
    try {
        let data = [];
        const cacheKey = `${code}_CURRENCY`;
        const dataCache = await getCache(cacheKey);
        if (dataCache) {
            data = dataCache;
        } else {
            data = await CurrencyModel.getByCode(code);
            await setCache(cacheKey, data);
        }

        return { status: 200, data };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ getByCode ~ error`, error);
        return { status: 500 };
    }
};

const conversion = async query => {
    try {
        const { from, to, amount } = query;

        if(formatCurrency(amount) == 'NaN') {
            return {
                status: 400,
                data: {
                    message: "Invalid format number. Use USD format. Eg. 1,500.00"
                }
            }
        }

        let currencies = null;
        const dataCache = await getCache('ALL_CURRENCIES');
        if (dataCache) {
            currencies = dataCache;
        } else {
            currencies = await CurrencyModel.getAll();
        }

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
        await updateCache();
        return { status: 201 };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ newCurrency ~ error`, error);
        return { status: 500 };
    }
};

const removeCurrency = async code => {
    try {
        await CurrencyModel.removeCurrency(code);
        await updateCache(code);
        return { status: 200 };
    } catch (error) {
        console.log(`🚀 ~ file: currency.js ~ removeCurrency ~ error`, error);
        return { status: 500 };
    }
};

const updateCache = async (removeCode = null) => {
    const results = await CurrencyModel.getAll();
    await setCache('ALL_CURRENCIES', results);

    if(removeCode) {
        await setCache(`${removeCode}_CURRENCY`, null);
    }
};

module.exports = {
    getAll,
    getByCode,
    conversion,
    newCurrency,
    removeCurrency,
    updateCache
}