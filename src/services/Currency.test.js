import _CurrencyService from './Currency';
import { CurrencyDB } from '../database';
import Utils from '../libs/Utils';

jest.mock('../database');

const CurrencyService = new _CurrencyService(CurrencyDB);

describe('#storeCurrency', () => {
    test('it throws an error when the currency is already registered', async () => {
        const currencyDTO = {
            currencyCode: "HURB"
        };
        const currency = {
            code: currencyDTO.currencyCode
        };

        CurrencyDB.listCurrencyByCode.mockResolvedValue([ currency ]);

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

describe('#deleteCurrency', () => {
    test('it throws an error when the provided currency does not exist', async () => {
        const currencyDTO = {
            currencyCode: 'HURB'
        }

        CurrencyDB.listCurrencyByCode.mockResolvedValue([]);

        try {
            await CurrencyService.deleteCurrency(currencyDTO);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(CurrencyDB.listCurrencyByCode).toBeCalledTimes(1);
            expect(CurrencyDB.listCurrencyByCode).toReturn();
        }
    });

    test('it throws an error when the currency cannot be deleted', async () => {
        const currencyDTO = {
            currencyCode: 'HURB'
        }
        const currency = {
            id: 42,
            code: currencyDTO.currencyCode
        };

        CurrencyDB.listCurrencyByCode.mockResolvedValue([ currency ]);
        CurrencyDB.deleteCurrency.mockRejectedValue(new Error());

        try {
            await CurrencyService.deleteCurrency(currencyDTO);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(CurrencyDB.listCurrencyByCode).toBeCalledTimes(1);
            expect(CurrencyDB.listCurrencyByCode).toReturn();
            expect(CurrencyDB.deleteCurrency).toBeCalledTimes(1);
        }
    });

    test('it returns the provided currency when the same is successfully deleted', async () => {
        const currencyDTO = {
            currencyCode: 'HURB'
        }
        const currency = {
            id: 42,
            code: currencyDTO.currencyCode
        };

        CurrencyDB.listCurrencyByCode.mockResolvedValue([ currency ]);
        CurrencyDB.deleteCurrency.mockResolvedValue({});

        try {
            const deletedCurrency = await CurrencyService.deleteCurrency(currencyDTO);

            expect(deletedCurrency).toBeTruthy();
            expect(deletedCurrency).toEqual(currencyDTO);
            expect(CurrencyDB.listCurrencyByCode).toBeCalledTimes(1);
            expect(CurrencyDB.listCurrencyByCode).toReturn();
            expect(CurrencyDB.deleteCurrency).toBeCalledTimes(1);
            expect(CurrencyDB.deleteCurrency).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});

describe('#convertsAmountBetweenCurrencies', () => {
    test('it throws an error when at least one of the provided currencies are not supported', async () => {
        const currencyConversionDTO = {
            from: 'ABC',
            to: 'CBA',
            amount: 152.98
        };

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, "listSupportedCurrencies");
        const arrayAContainsBMock = jest.spyOn(Utils, "arrayAContainsB");
        
        listSupportedCurrenciesMock.mockImplementation(jest.mock());
        listSupportedCurrenciesMock.mockResolvedValue([]);
        arrayAContainsBMock.mockImplementation(jest.mock());
        arrayAContainsBMock.mockReturnValue(false);

        try {
            await CurrencyService.convertsAmountBetweenCurrencies(currencyConversionDTO);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(listSupportedCurrenciesMock).toBeCalledTimes(1);
            expect(listSupportedCurrenciesMock).toReturn();
            expect(arrayAContainsBMock).toBeCalledTimes(1);
            expect(arrayAContainsBMock).toReturn();
        }
        
        listSupportedCurrenciesMock.mockRestore();
        arrayAContainsBMock.mockRestore();
    });
    
});