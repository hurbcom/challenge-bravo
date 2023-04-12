import { Currency } from '../../src/modules/currency/entities';

export const CurrencyStub = (code: string = 'USD'): Currency => {
    switch (code) {
        case 'USD':
            return {
                name: 'USD Coin',
                code: 'USD',
                supportCode: 'USD',
                exchangeRate: '1',
                type: 'FIAT',
                created: new Date(),
            };

        case 'BRL':
            return {
                name: 'BRL Coin',
                code: 'BRL',
                supportCode: 'USD',
                exchangeRate: '0.20',
                type: 'FIAT',
                created: new Date(),
            };

        default:
            break;
    }
};
