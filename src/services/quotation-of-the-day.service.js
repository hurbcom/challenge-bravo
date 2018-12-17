import fs from 'fs';

import openExchangeratesQuotation from './openexchangerates.service';
import currencyLayerQuotation from './currencylayer.service';
import coinmarketcapQuotation from './coinmarketcap.service';
import cryptoCompareQuotation from './cryptocompare.service';

import acceptedCurrencies from '../data/accepted-currencies.json';

const convertETHtoUSD = ETHUSD => 1 / ETHUSD;

const getRateCoin = async () => {
    const openExchangeratesResult = await openExchangeratesQuotation(acceptedCurrencies['accept-coins'].join());
    if (!openExchangeratesResult.error) {
        return openExchangeratesResult;
    }

    const currencyLayerResult = await currencyLayerQuotation(acceptedCurrencies['accept-coins'].join());
    if (!currencyLayerResult.error) {
        return currencyLayerResult;
    }

    return { USD: 0 };
};

const getRateCryptoCoin = async () => {
    const coinmarketcapResult = await coinmarketcapQuotation();

    if (coinmarketcapResult.status.error_code === 0) {
        const ETH = convertETHtoUSD(coinmarketcapResult.data.ETH.quote.USD.price);
        return { ETH };
    }

    const cryptoCompareResult = await cryptoCompareQuotation();
    if (!cryptoCompareResult.error) {
        const ETH = convertETHtoUSD(cryptoCompareResult.USD);
        return { ETH };
    }

    return { ETH: 0 };
};

const updateExchangeRate = async (filePath) => {
    const coinQuote = await getRateCoin();
    const cryptoCoinQuote = await getRateCryptoCoin();

    const exRate = {
        updateDate: new Date(),
        ...coinQuote,
        ...cryptoCoinQuote,
    };

    fs.writeFile(filePath, JSON.stringify(exRate), 'utf8', (err) => {
        if (err) {
            return false;
        };

        console.log('-> The quote was updated');
        return true;
    });
};

export { updateExchangeRate as default };
