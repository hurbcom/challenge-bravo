import fs from 'fs';

import openExchangeratesQuotation from './openexchangerates.service';
import currencyLayerQuotation from './currencylayer.service';
import coinmarketcapQuotation from './coinmarketcap.service';
import acceptedCurrencies from '../data/accepted-currencies.json';

const convertETHtoUSD = (ETHUSD) => {
    return 1 / ETHUSD;
};

const getRateCoin = async () => {
    const openExchangeratesResult = await openExchangeratesQuotation(acceptedCurrencies['accept-coins'].join());
    if (!openExchangeratesResult.error) {
        return openExchangeratesResult;
    }

    console.log('Erro no servico openExchangeratesConvert');

    const currencyLayerResult = await currencyLayerQuotation(acceptedCurrencies['accept-coins'].join());
    if (!currencyLayerResult.error) {
        return currencyLayerResult;
    }

    console.log('Erro no servico currencyLayerConvert');

    return { USD: 0 };
};

const getRateCryptoCoin = async () => {
    const coinmarketcapResult = await coinmarketcapQuotation();
    if (coinmarketcapResult.status.error_code !== 0) {
        return 0;
    }
    const ETH = convertETHtoUSD(coinmarketcapResult.data.ETH.quote.USD.price)
    return { ETH };
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
            console.log(err);
            return false;
        };

        console.log('-> The quote was updated');
        return true;
    });
};

export { updateExchangeRate as default };
