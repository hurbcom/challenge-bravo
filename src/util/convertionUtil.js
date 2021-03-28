const CURRENCY_API =
    process.env.CURRENCY_API || "https://economia.awesomeapi.com.br/json/all/";
const WEAK_COIN = process.env.WEAK_COIN || "BRL";
const getRequest = require("./requestUtil");
const cacheUtil = require("./cacheUtil");

const buildUrl = (symbol) => {
    return `${CURRENCY_API}${symbol}-${WEAK_COIN}`;
};

const getCurrencyQuote = async (symbol) => {
    let url = buildUrl(symbol);
    let quote = await cacheUtil.getFromCache(url);
    if (!quote) {
        quote = await getRequest(url);
        cacheUtil.putToCache(url, quote);
    }
    return quote[symbol].high;
};

const baseCurrencyConvertion = async (symbol) => {
    let baseCurrencyQuote = await getCurrencyQuote("USD");

    if (symbol == "BRL") {
        convertionQuote = 1;
    } else {
        convertionQuote = await getCurrencyQuote(symbol);
    }

    return convertionQuote / baseCurrencyQuote;
};

module.exports = baseCurrencyConvertion;
