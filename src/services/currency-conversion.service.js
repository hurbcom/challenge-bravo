/* eslint-disable import/prefer-default-export */
import fs from 'fs';

import { openExchangeratesConvert } from './openexchangerates.service';
import { currencyLayerConvert } from './currencylayer.service';
import { coinmarketcapConvert } from './coinmarketcap.service';

const getRate = async () => {
    const openExchangeratesResult = await openExchangeratesConvert();
    if (!openExchangeratesResult.error) {
        return openExchangeratesResult;
    }

    console.log('Erro no servico openExchangeratesConvert');

    const currencyLayerResult = await currencyLayerConvert();
    if (!currencyLayerResult.error) {
        return currencyLayerResult;
    }

    console.log('Erro no servico currencyLayerConvert');

    return { USD: 0 };
};

const getRateCoin = async () => {
    const coinmarketcapResult = await coinmarketcapConvert();
    if (coinmarketcapResult.status.error_code !== 0) {
        return 0;
    }

    const ETHUSD = coinmarketcapResult.data.ETH.quote.USD.price;
    const eth = 1 / ETHUSD;
    return eth;
};

export const updateExchangeRate = async (filePath) => {
    const money = await getRate();

    if (money.error) {
        console.log(money.error);
        return;
    }

    const coin = await getRateCoin();

    const exRate = {
        updateDate: new Date(),
        ETH: coin,
        ...money,
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
