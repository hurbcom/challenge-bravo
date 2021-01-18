const dbHandler = require('../db/database_handler');
const CurrencyService =  require('../src/services/CurrencyService');

describe("Currency", () => {
    beforeAll(async () => await dbHandler.dbConnect('currencies', 'test'));
    afterEach(async () => await dbHandler.dbClear());
    afterAll(async () => await dbHandler.dbClose());

    it("Deve retornar uma moeda quando os parametros forem válidos", async () => {
        await CurrencyService.create(validCurrencyParams);
        const currency = await CurrencyService.findBySymbol(validCurrencyParams.symbol);

        expect(currency.symbol).toBe(validCurrencyParams.symbol);
        expect(currency.label).toBe(validCurrencyParams.label);
    });

    it("Deve uma excessão quando os parametros forem inválidos", () => {
        expect(CurrencyService.create(invalidCurrencyParams))
        .rejects
        .toThrow('Currency validation failed: symbol: Path `symbol` is required');
    });

    it("Deve retornar false quando remover uma moeda", async () => {
        await CurrencyService.create(validCurrencyParams);
        await CurrencyService.delete(validCurrencyParams.symbol)
        const currency = await CurrencyService.findBySymbol(validCurrencyParams.symbol);

        expect(currency).toBeFalsy();
    })
});

const validCurrencyParams = {
    symbol: 'BRL',
    label: 'Brazilian Real'
}

const invalidCurrencyParams = {
    symbol: null,
    label: 'Brazilian Real'
}