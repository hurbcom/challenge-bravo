import _CurrencyService from './Currency';
import { CurrencyDB } from '../database';

jest.mock('../database');

const CurrencyService = new _CurrencyService(CurrencyDB);

describe('#storeCurrency', () => {
    test('it throws an error when the currency is already registered', async () => {
        const currencyDTO = {
            currencyCode: "HURB"
        };

        CurrencyDB.listCurrencyByCode.mockResolvedValue([ currencyDTO ]);

        try {
            await CurrencyService.storeCurrency(currencyDTO);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(CurrencyDB.listCurrencyByCode).toBeCalledTimes(1);
            expect(CurrencyDB.listCurrencyByCode).toReturn();
        }
    });

    test('it throws an error when a real currency cannot be registered', async () => {
        const currencyDTO = {
            currencyCode: "HURB"
        };

        CurrencyDB.listCurrencyByCode.mockResolvedValue([]);
        CurrencyDB.storeRealCurrency.mockRejectedValue(new Error());

        try {
            await CurrencyService.storeCurrency(currencyDTO);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(CurrencyDB.listCurrencyByCode).toBeCalledTimes(1);
            expect(CurrencyDB.listCurrencyByCode).toReturn();
            expect(CurrencyDB.storeRealCurrency).toBeCalledTimes(1);
            expect(CurrencyDB.storeFictitiousCurrency).not.toBeCalled();
        }
    });

    test('it throws an error when a fictitious currency cannot be registered', async () => {
        const currencyDTO = {
            currencyCode: "HURB",
            currencyQuote: 1.2
        };

        CurrencyDB.listCurrencyByCode.mockResolvedValue([]);
        CurrencyDB.storeFictitiousCurrency.mockRejectedValue(new Error());

        try {
            await CurrencyService.storeCurrency(currencyDTO);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(CurrencyDB.listCurrencyByCode).toBeCalledTimes(1);
            expect(CurrencyDB.listCurrencyByCode).toReturn();
            expect(CurrencyDB.storeFictitiousCurrency).toBeCalledTimes(1);
            expect(CurrencyDB.storeRealCurrency).not.toBeCalled();
        }
    });

    test('it returns the provided currency when the same is successfully registered', async() => {
        const currencyDTO = {
            currencyCode: "HURB",
            currencyQuote: 1.2
        };

        CurrencyDB.listCurrencyByCode.mockResolvedValue([]);
        CurrencyDB.storeFictitiousCurrency.mockResolvedValue({});

        try {
            const newCurrency = await CurrencyService.storeCurrency(currencyDTO);

            expect(newCurrency).toBeTruthy();
            expect(newCurrency).toEqual(currencyDTO);
            expect(CurrencyDB.listCurrencyByCode).toBeCalledTimes(1);
            expect(CurrencyDB.listCurrencyByCode).toReturn();
            expect(CurrencyDB.storeFictitiousCurrency).toBeCalledTimes(1);
            expect(CurrencyDB.storeFictitiousCurrency).toReturn();
            expect(CurrencyDB.storeRealCurrency).not.toBeCalled();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});