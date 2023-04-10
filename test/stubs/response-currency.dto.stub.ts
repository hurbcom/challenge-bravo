import { ResponseCurrencyDto } from 'src/modules/currency/dto';

export const ResponseCurrencyDtoStub = (): ResponseCurrencyDto => {
    return {
        code: 'BRL',
        name: 'Brazilian Real',
        exchangeRate: '5.0595',
        type: 'FIAT',
        lastUpdate: '2023-04-09 02:47:39',
    };
};
