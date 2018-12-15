/* eslint-disable import/prefer-default-export */
import fs from 'fs';

import { openExchangeratesConvert } from './openexchangerates.service';
import { currencyLayerConvert } from './currencylayer.service';

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

    return { error: 'Serviços indisponíveis, por favor tente mais tarde' };
};

export const updateExchangeRate = async (filePath) => {
    const money = await getRate();

    if (money.error) {
        console.log(money.error);
        return;
    }

    const exRate = {
        updateDate: new Date(),
        ...money,
    };

    fs.writeFile(filePath, JSON.stringify(exRate), 'utf8', (err) => {
        if (err) {
            console.log(err);
            return false;
        };

        console.log('The file has been saved!');
        return true;
    });
};
