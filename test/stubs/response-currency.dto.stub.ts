import { ResponseCurrencyDto } from 'src/modules/currency/dto';

export const ResponseCurrencyDtoStub = (): ResponseCurrencyDto => {
    return {
        code: 'PSN',
        name: 'PSN Coin',
        exchangeRate: 14792.899408284,
        type: 'FICTITIUM',
        lastUpdate: '2023-04-09 02:47:39',
    };
};
