import _CurrencyService from './Currency';
import { CurrencyDB } from '../integrations/database';
import Utils from '../libs/Utils';

jest.mock('../integrations/database');

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
        const currencyCodeFrom = 'ABC';
        const currencyCodeTo = 'CBA';
        const amount = 152.98;

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, "listSupportedCurrencies");
        const arrayAContainsBMock = jest.spyOn(Utils, "arrayAContainsB");
        
        listSupportedCurrenciesMock.mockImplementation(jest.mock());
        listSupportedCurrenciesMock.mockResolvedValue([]);
        arrayAContainsBMock.mockImplementation(jest.mock());
        arrayAContainsBMock.mockReturnValue(false);

        try {
            await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);
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

    test('it returns the same amount when the provided currencies are supported and the same', async () => {
        const currencyCodeFrom = 'HURB';
        const amount = 152.98;

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, "listSupportedCurrencies");
        const arrayAContainsBMock = jest.spyOn(Utils, "arrayAContainsB");
        
        listSupportedCurrenciesMock.mockImplementation(jest.mock());
        listSupportedCurrenciesMock.mockResolvedValue([ currencyCodeFrom ]);
        arrayAContainsBMock.mockImplementation(jest.mock());
        arrayAContainsBMock.mockReturnValue(true);

        try {
            const convertedAmount = await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeFrom, amount);

            expect(convertedAmount).toBe(amount);
            expect(listSupportedCurrenciesMock).toBeCalledTimes(1);
            expect(listSupportedCurrenciesMock).toReturn();
            expect(arrayAContainsBMock).toBeCalledTimes(1);
            expect(arrayAContainsBMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
        
        listSupportedCurrenciesMock.mockRestore();
        arrayAContainsBMock.mockRestore();
    });
 
    test('it returns the converted amount when the provided currencies are supported and ficticious', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;
        const convertedAmount = 1;
        const ficticiousCurrenciesList = [
            {
                currencyCode: currencyCodeFrom,
                currencyQuote: 1
            },
            {
                currencyCode: currencyCodeTo,
                currencyQuote: 1
            }
        ];

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, "listSupportedCurrencies");
        const arrayAContainsBMock = jest.spyOn(Utils, "arrayAContainsB");
        const _convertAmountMock = jest.spyOn(CurrencyService, "_convertAmount");
        
        listSupportedCurrenciesMock.mockImplementation(jest.mock());
        listSupportedCurrenciesMock.mockResolvedValue([ currencyCodeFrom, currencyCodeTo ]);
        arrayAContainsBMock.mockImplementation(jest.mock());
        arrayAContainsBMock.mockReturnValue(true);
        _convertAmountMock.mockImplementation(jest.mock());
        _convertAmountMock.mockReturnValue(convertedAmount);
        CurrencyDB.listCurrenciesQuoteByCode.mockResolvedValue(ficticiousCurrenciesList);

        try {
            const convertedAmount = await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);

            expect(convertedAmount).toBe(convertedAmount);
            expect(listSupportedCurrenciesMock).toBeCalledTimes(1);
            expect(listSupportedCurrenciesMock).toReturn();
            expect(arrayAContainsBMock).toBeCalledTimes(1);
            expect(arrayAContainsBMock).toReturn();
            expect(_convertAmountMock).toBeCalledTimes(1);
            expect(_convertAmountMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
        
        listSupportedCurrenciesMock.mockRestore();
        arrayAContainsBMock.mockRestore();
        _convertAmountMock.mockRestore();
    });
    
});