import _CurrencyService from './Currency';
import { CurrencyDB } from '../integrations/database';
import utils from '../libs/Utils';

jest.mock('../libs/Utils');
jest.mock('../integrations/database');

global.utils = utils;

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

describe('#checkSupportedCurrenciesCodes', () => {
    test('it throws an error when the supported currencies cannot be listed', async () => {
        const currencyCode1 = 'HURB';

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, 'listSupportedCurrencies');

        listSupportedCurrenciesMock.mockImplementation(() => new Error());

        try {
            await CurrencyService.checkSupportedCurrenciesCodes(currencyCode1);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(listSupportedCurrenciesMock).toBeCalledTimes(1);
        }

        listSupportedCurrenciesMock.mockRestore();
    });

    test("it returns false when the provided currencies' codes are not supported", async () => {
        const currencyCode1 = 'HURB';

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, 'listSupportedCurrencies');

        listSupportedCurrenciesMock.mockImplementation(() => new Error());
        utils.arrayAContainsB.mockReturnValue(false);

        try {
            const result = await CurrencyService.checkSupportedCurrenciesCodes(currencyCode1);

            expect(result).toBe(false);
            expect(listSupportedCurrenciesMock).toBeCalledTimes(1);
            expect(listSupportedCurrenciesMock).toReturn();
            expect(utils.arrayAContainsB).toBeCalledTimes(1);
            expect(utils.arrayAContainsB).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }

        listSupportedCurrenciesMock.mockRestore();
    });

    test("it returns true when the provided currencies' codes are supported", async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'BRUH';

        const listSupportedCurrenciesMock = jest.spyOn(CurrencyService, 'listSupportedCurrencies');

        listSupportedCurrenciesMock.mockImplementation(() => new Error());
        utils.arrayAContainsB.mockReturnValue(true);

        try {
            const result = await CurrencyService.checkSupportedCurrenciesCodes(currencyCode1, currencyCode2);

            expect(result).toBe(true);
            expect(listSupportedCurrenciesMock).toBeCalledTimes(1);
            expect(listSupportedCurrenciesMock).toReturn();
            expect(utils.arrayAContainsB).toBeCalledTimes(1);
            expect(utils.arrayAContainsB).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }

        listSupportedCurrenciesMock.mockRestore();
    });
});

describe('#retrieveCurrenciesInfo', () => {
    test('it throws an error when the backing currency info cannot be listed', async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'BRUH';

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');

        listBackingCurrencyMock.mockImplementation(() => new Error());

        try {
            await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
        }

        listBackingCurrencyMock.mockRestore();
    });

    test('it throws an error when ficticious currencies info cannot be listed', async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'BRUH';
        const backingCurrency = {
            currencyCode: 'USD',
            currencyQuote: 1
        };

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');
        const listFicticiousCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listFicticiousCurrenciesByCode');

        listBackingCurrencyMock.mockImplementation(() => backingCurrency);
        listFicticiousCurrenciesByCodeMock.mockImplementation(() => new Error());

        try {
            await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
            expect(listBackingCurrencyMock).toReturn();
            expect(listFicticiousCurrenciesByCodeMock).toBeCalledTimes(1);
        }

        listBackingCurrencyMock.mockRestore();
        listFicticiousCurrenciesByCodeMock.mockRestore();
    });

    test('it throws an error when real currencies info cannot be listed', async () => {
        const currencyCode1 = 'BRL';
        const currencyCode2 = 'EUR';
        const backingCurrency = {
            currencyCode: 'USD',
            currencyQuote: 1
        };

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');
        const listFicticiousCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listFicticiousCurrenciesByCode');
        const listRealCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listRealCurrenciesByCode');

        listBackingCurrencyMock.mockImplementation(() => backingCurrency);
        listFicticiousCurrenciesByCodeMock.mockImplementation(() => []);
        listRealCurrenciesByCodeMock.mockImplementation(() => new Error());

        try {
            await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
            expect(listBackingCurrencyMock).toReturn();
            expect(listFicticiousCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listFicticiousCurrenciesByCodeMock).toReturn();
            expect(listRealCurrenciesByCodeMock).toBeCalledTimes(1);
        }

        listBackingCurrencyMock.mockRestore();
        listFicticiousCurrenciesByCodeMock.mockRestore();
        listRealCurrenciesByCodeMock.mockRestore();
    });
    
    test('it throws an error when the provided currencies are not supported', async () => {
        const currencyCode1 = 'BRL';
        const currencyCode2 = 'EUR';
        const backingCurrency = {
            currencyCode: 'USD',
            currencyQuote: 1
        };

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');
        const listFicticiousCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listFicticiousCurrenciesByCode');
        const listRealCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listRealCurrenciesByCode');

        listBackingCurrencyMock.mockImplementation(() => backingCurrency);
        listFicticiousCurrenciesByCodeMock.mockImplementation(() => []);
        listRealCurrenciesByCodeMock.mockImplementation(() => []);

        try {
            await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
            expect(listBackingCurrencyMock).toReturn();
            expect(listFicticiousCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listFicticiousCurrenciesByCodeMock).toReturn();
            expect(listRealCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listRealCurrenciesByCodeMock).toReturn();
        }

        listBackingCurrencyMock.mockRestore();
        listFicticiousCurrenciesByCodeMock.mockRestore();
        listRealCurrenciesByCodeMock.mockRestore();
    });

    test('it returns a list with the currencies info when one is ficticious and the other is the backing currency', async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'USD';
        const ficticiousCurrency = {
            currencyCode: currencyCode1,
            currencyQuote: 0.76
        };
        const backingCurrency = {
            currencyCode: currencyCode2,
            currencyQuote: 1
        };

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');
        const listFicticiousCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listFicticiousCurrenciesByCode');

        listBackingCurrencyMock.mockImplementation(() => backingCurrency);
        listFicticiousCurrenciesByCodeMock.mockImplementation(() => [ ficticiousCurrency ]);

        try {
            const currenciesList = await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);

            expect(currenciesList).toBeTruthy();
            expect(currenciesList).toEqual(expect.arrayContaining([ backingCurrency, ficticiousCurrency ]));
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
            expect(listBackingCurrencyMock).toReturn();
            expect(listFicticiousCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listFicticiousCurrenciesByCodeMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }

        listBackingCurrencyMock.mockRestore();
        listFicticiousCurrenciesByCodeMock.mockRestore();
    });

    test('it returns a list with the currencies info when both are ficticious', async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'BRUH';
        const ficticiousCurrenciesList = [
            {
                currencyCode: currencyCode1,
                currencyQuote: 0.76
            },
            {
                currencyCode: currencyCode2,
                currencyQuote: 7.06
            }
        ];
        const backingCurrency = {
            currencyCode: 'USD',
            currencyQuote: 1
        };

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');
        const listFicticiousCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listFicticiousCurrenciesByCode');

        listBackingCurrencyMock.mockImplementation(() => backingCurrency);
        listFicticiousCurrenciesByCodeMock.mockImplementation(() => ficticiousCurrenciesList);

        try {
            const currenciesList = await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);

            expect(currenciesList).toBeTruthy();
            expect(currenciesList).toEqual(expect.arrayContaining(ficticiousCurrenciesList));
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
            expect(listBackingCurrencyMock).toReturn();
            expect(listFicticiousCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listFicticiousCurrenciesByCodeMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }

        listBackingCurrencyMock.mockRestore();
        listFicticiousCurrenciesByCodeMock.mockRestore();
    });

    test('it returns a list with the currencies info when one is ficticious and the other is real', async () => {
        const currencyCode1 = 'HURB';
        const currencyCode2 = 'BRL';
        const ficticiousCurrency = {
            currencyCode: currencyCode1,
            currencyQuote: 0.76
        };
        const realCurrency = {
            currencyCode: currencyCode2,
            currencyQuote: 7.06
        };
        const backingCurrency = {
            currencyCode: 'USD',
            currencyQuote: 1
        };

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');
        const listFicticiousCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listFicticiousCurrenciesByCode');
        const listRealCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listRealCurrenciesByCode');

        listBackingCurrencyMock.mockImplementation(() => backingCurrency);
        listFicticiousCurrenciesByCodeMock.mockImplementation(() => [ ficticiousCurrency ]);
        listRealCurrenciesByCodeMock.mockImplementation(() => [ realCurrency ]);

        try {
            const currenciesList = await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);

            expect(currenciesList).toBeTruthy();
            expect(currenciesList).toEqual(expect.arrayContaining([ ficticiousCurrency, realCurrency ]));
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
            expect(listBackingCurrencyMock).toReturn();
            expect(listFicticiousCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listFicticiousCurrenciesByCodeMock).toReturn();
            expect(listRealCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listRealCurrenciesByCodeMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }

        listBackingCurrencyMock.mockRestore();
        listFicticiousCurrenciesByCodeMock.mockRestore();
        listRealCurrenciesByCodeMock.mockRestore();
    });

    test('it returns a list with the currencies info when one is real and the other is the backing currency', async () => {
        const currencyCode1 = 'USD';
        const currencyCode2 = 'BRL';
        const backingCurrency = {
            currencyCode: currencyCode1,
            currencyQuote: 1
        };
        const realCurrency = {
            currencyCode: currencyCode2,
            currencyQuote: 7.06
        };

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');
        const listFicticiousCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listFicticiousCurrenciesByCode');
        const listRealCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listRealCurrenciesByCode');

        listBackingCurrencyMock.mockImplementation(() => backingCurrency);
        listFicticiousCurrenciesByCodeMock.mockImplementation(() => []);
        listRealCurrenciesByCodeMock.mockImplementation(() => [ realCurrency ]);

        try {
            const currenciesList = await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);

            expect(currenciesList).toBeTruthy();
            expect(currenciesList).toEqual(expect.arrayContaining([ backingCurrency, realCurrency ]));
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
            expect(listBackingCurrencyMock).toReturn();
            expect(listFicticiousCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listFicticiousCurrenciesByCodeMock).toReturn();
            expect(listRealCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listRealCurrenciesByCodeMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }

        listBackingCurrencyMock.mockRestore();
        listFicticiousCurrenciesByCodeMock.mockRestore();
        listRealCurrenciesByCodeMock.mockRestore();
    });

    test('it returns a list with the currencies info when both are real', async () => {
        const currencyCode1 = 'BRL';
        const currencyCode2 = 'EUR';
        const realCurrenciesList = [
            {
                currencyCode: currencyCode1,
                currencyQuote: 0.06
            },
            {
                currencyCode: currencyCode2,
                currencyQuote: 7.06
            }
        ];
        const backingCurrency = {
            currencyCode: 'USD',
            currencyQuote: 1
        };

        const listBackingCurrencyMock = jest.spyOn(CurrencyService, 'listBackingCurrency');
        const listFicticiousCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listFicticiousCurrenciesByCode');
        const listRealCurrenciesByCodeMock = jest.spyOn(CurrencyService, 'listRealCurrenciesByCode');

        listBackingCurrencyMock.mockImplementation(() => backingCurrency);
        listFicticiousCurrenciesByCodeMock.mockImplementation(() => []);
        listRealCurrenciesByCodeMock.mockImplementation(() => realCurrenciesList);

        try {
            const currenciesList = await CurrencyService.retrieveCurrenciesInfo(currencyCode1, currencyCode2);

            expect(currenciesList).toBeTruthy();
            expect(currenciesList).toEqual(expect.arrayContaining(realCurrenciesList));
            expect(listBackingCurrencyMock).toBeCalledTimes(1);
            expect(listBackingCurrencyMock).toReturn();
            expect(listFicticiousCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listFicticiousCurrenciesByCodeMock).toReturn();
            expect(listRealCurrenciesByCodeMock).toBeCalledTimes(1);
            expect(listRealCurrenciesByCodeMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }

        listBackingCurrencyMock.mockRestore();
        listFicticiousCurrenciesByCodeMock.mockRestore();
        listRealCurrenciesByCodeMock.mockRestore();
    });
});

describe('#convertsAmountBetweenCurrencies', () => {
    test('it throws an error when the supported currencies codes cannot be listed', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;

        const checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "checkSupportedCurrenciesCodes");
        
        checkSupportedCurrenciesCodesMock.mockImplementation(() => new Error());

        try {
            await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
        }
        
        checkSupportedCurrenciesCodesMock.mockRestore();
    });
    
    test('it throws an error when the provided currencies are not supported', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;

        const checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "checkSupportedCurrenciesCodes");
        
        checkSupportedCurrenciesCodesMock.mockImplementation(() => false);

        try {
            await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
            expect(checkSupportedCurrenciesCodesMock).toReturn();
        }
        
        checkSupportedCurrenciesCodesMock.mockRestore();
    });

    test('it returns the same amount when the provided currencies are supported and the same', async () => {
        const currencyCodeFrom = 'HURB';
        const amount = 152.98;

        const checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "checkSupportedCurrenciesCodes");
        
        checkSupportedCurrenciesCodesMock.mockImplementation(() => [ currencyCodeFrom ]);

        try {
            const { amount : convertedAmount } = await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeFrom, amount);

            expect(convertedAmount).toBe(amount);
            expect(checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
            expect(checkSupportedCurrenciesCodesMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
        
        checkSupportedCurrenciesCodesMock.mockRestore();
    });
 
    test('it throws an error when the provided currencies are supported, but cannot be retrieved', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;

        const checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "checkSupportedCurrenciesCodes");
        const _retrieveCurrenciesInfoMock = jest.spyOn(CurrencyService, "retrieveCurrenciesInfo");
        
        checkSupportedCurrenciesCodesMock.mockImplementation(() => true);
        _retrieveCurrenciesInfoMock.mockImplementation(() => new Error());

        try {
            await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);
        } catch (err) {
            expect(err).toBeTruthy();
            expect(checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
            expect(checkSupportedCurrenciesCodesMock).toReturn();
            expect(_retrieveCurrenciesInfoMock).toBeCalledTimes(1);
        }
        
        checkSupportedCurrenciesCodesMock.mockRestore();
        _retrieveCurrenciesInfoMock.mockRestore();
    });
 
    test('it returns the converted amount when the provided currencies are supported and retrieved', async () => {
        const currencyCodeFrom = 'HURB';
        const currencyCodeTo = 'BRUH';
        const amount = 152.98;
        const finalAmount = 52.9;

        const checkSupportedCurrenciesCodesMock = jest.spyOn(CurrencyService, "checkSupportedCurrenciesCodes");
        const _retrieveCurrenciesInfoMock = jest.spyOn(CurrencyService, "retrieveCurrenciesInfo");
        const _convertAmountMock = jest.spyOn(CurrencyService, "_calculatesConvertedAmount");
        
        checkSupportedCurrenciesCodesMock.mockImplementation(() => true);
        _retrieveCurrenciesInfoMock.mockImplementation(() => finalAmount);

        try {
            const { amount : convertedAmount } = await CurrencyService.convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount);

            expect(convertedAmount).toBe(finalAmount);
            expect(checkSupportedCurrenciesCodesMock).toBeCalledTimes(1);
            expect(checkSupportedCurrenciesCodesMock).toReturn();
            expect(_retrieveCurrenciesInfoMock).toBeCalledTimes(1);
            expect(_retrieveCurrenciesInfoMock).toReturn();
            expect(_convertAmountMock).toBeCalledTimes(1);
            expect(_convertAmountMock).toReturn();
        } catch (err) {
            expect(err).toBeTruthy();
        }
        
        checkSupportedCurrenciesCodesMock.mockRestore();
        _retrieveCurrenciesInfoMock.mockRestore();
        _convertAmountMock.mockRestore();
    });
});