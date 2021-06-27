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

describe('#_checkSupportedCurrenciesCodes', () => {
    test('it throws an error when the supported currencies cannot be listed', async () => {
        const currencyCode1 = 'HURB';

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, 'listSupportedCurrencies');

        listSupportedCurrenciesMock.mockImplementation(() => new Error());

        try {
            await CurrencyService._checkSupportedCurrenciesCodes(currencyCode1);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(listSupportedCurrenciesMock).toBeCalledTimes(1);
        }

        listSupportedCurrenciesMock.mockRestore();
    });

    test("it returns false when the provided currencies' codes are not supported", async () => {
        const currencyCode1 = 'HURB';

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, 'listSupportedCurrencies');
        const arrayAContainsBMock = jest.spyOn(Utils, 'arrayAContainsB');

        listSupportedCurrenciesMock.mockImplementation(() => new Error());
        arrayAContainsBMock.mockImplementation(() => false);

        try {
            const result = await CurrencyService._checkSupportedCurrenciesCodes(currencyCode1);

            expect(result).toBe(false);
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

    test("it returns true when the provided currencies' codes are supported", async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'BRUH';

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, 'listSupportedCurrencies');
        const arrayAContainsBMock = jest.spyOn(Utils, 'arrayAContainsB');

        listSupportedCurrenciesMock.mockImplementation(() => new Error());
        arrayAContainsBMock.mockImplementation(() => true);

        try {
            const result = await CurrencyService._checkSupportedCurrenciesCodes(currencyCode1, currencyCode2);

            expect(result).toBe(true);
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
});

describe('#_retrieveCurrenciesInfo', () => {
    test('it throws an error when ficticious currencies info cannot be listed', async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'BRUH';

        CurrencyDB.listCurrenciesQuoteByCode.mockRejectedValue(new Error());

        try {
            await CurrencyService._retrieveCurrenciesInfo(currencyCode1, currencyCode2);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(CurrencyDB.listCurrenciesQuoteByCode).toBeCalledTimes(1);
        }
    });

    test('it returns a list with the ficticious currencies when all provided currencies can be listed and are ficticious', async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'BRUH';
        const ficticiousCurrenciesList = [
            {
                currencyCode: currencyCode1,
                currencyQuote: 0.78
            }, 
            {
                currencyCode: currencyCode2,
                currencyQuote: 8.05
            },
        ];

        CurrencyDB.listCurrenciesQuoteByCode.mockResolvedValue(ficticiousCurrenciesList);

        try {
            const result = await CurrencyService._retrieveCurrenciesInfo(currencyCode1, currencyCode2);

            expect(result).toBe(ficticiousCurrenciesList);
            expect(CurrencyDB.listCurrenciesQuoteByCode).toBeCalledTimes(1);
            expect(CurrencyDB.listCurrenciesQuoteByCode).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});

describe('#convertsAmountBetweenCurrencies', () => {
    test('it throws an error when the supported currencies codes cannot be listed', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;

        const _checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "_checkSupportedCurrenciesCodes");
        
        _checkSupportedCurrenciesCodesMock.mockImplementation(() => new Error());

        try {
            await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(_checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
        }
        
        _checkSupportedCurrenciesCodesMock.mockRestore();
    });
    
    test('it throws an error when the provided currencies are not supported', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;

        const _checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "_checkSupportedCurrenciesCodes");
        
        _checkSupportedCurrenciesCodesMock.mockImplementation(() => false);

        try {
            await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(_checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
            expect(_checkSupportedCurrenciesCodesMock).toReturn();
        }
        
        _checkSupportedCurrenciesCodesMock.mockRestore();
    });

    test('it returns the same amount when the provided currencies are supported and the same', async () => {
        const currencyCodeFrom = 'HURB';
        const amount = 152.98;

        const _checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "_checkSupportedCurrenciesCodes");
        
        _checkSupportedCurrenciesCodesMock.mockImplementation(() => [ currencyCodeFrom ]);

        try {
            const convertedAmount = await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeFrom, amount);

            expect(convertedAmount).toBe(amount);
            expect(_checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
            expect(_checkSupportedCurrenciesCodesMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
        
        _checkSupportedCurrenciesCodesMock.mockRestore();
    });
 
    test('it throws an error when the provided currencies are supported, but cannot be retrieved', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;

        const _checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "_checkSupportedCurrenciesCodes");
        const _retrieveCurrenciesInfoMock = jest.spyOn(CurrencyService, "_retrieveCurrenciesInfo");
        
        _checkSupportedCurrenciesCodesMock.mockImplementation(() => true);
        _retrieveCurrenciesInfoMock.mockImplementation(() => new Error());

        try {
            await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(_checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
            expect(_checkSupportedCurrenciesCodesMock).toReturn();
            expect(_retrieveCurrenciesInfoMock).toBeCalledTimes(1);
        }
        
        _checkSupportedCurrenciesCodesMock.mockRestore();
        _retrieveCurrenciesInfoMock.mockRestore();
    });
 
    test('it returns the converted amount when the provided currencies are supported and retrieved', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;
        const convertedAmount = 52.9;

        const _checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "_checkSupportedCurrenciesCodes");
        const _retrieveCurrenciesInfoMock = jest.spyOn(CurrencyService, "_retrieveCurrenciesInfo");
        const _convertAmountMock = jest.spyOn(CurrencyService, "_convertAmount");
        
        _checkSupportedCurrenciesCodesMock.mockImplementation(() => true);
        _retrieveCurrenciesInfoMock.mockImplementation(() => convertedAmount);

        try {
            const result = await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);

            expect(result).toBe(convertedAmount);
            expect(_checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
            expect(_checkSupportedCurrenciesCodesMock).toReturn();
            expect(_retrieveCurrenciesInfoMock).toBeCalledTimes(1);
            expect(_retrieveCurrenciesInfoMock).toReturn();
            expect(_convertAmountMock).toBeCalledTimes(1);
            expect(_convertAmountMock).toReturn();
        } catch (err) {
            expect(err).toBeTruthy();
        }
        
        _checkSupportedCurrenciesCodesMock.mockRestore();
        _retrieveCurrenciesInfoMock.mockRestore();
        _convertAmountMock.mockRestore();
    });
    
});