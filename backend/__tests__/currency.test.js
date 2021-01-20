const dbHandler = require('../db/database_handler');
const CurrencyService =  require('../src/services/CurrencyService');

describe("Currency", () => {
    beforeAll(async () => await dbHandler.dbConnect('hurb', 'test'));
    afterEach(async () => await dbHandler.dbClear());
    afterAll(async () => await dbHandler.dbClose(true));

    it("Deve retornar uma moeda quando os parametros forem válidos", async () => {
        await CurrencyService.create(validCurrencyParams);
        const currency = await CurrencyService.findBySymbol(validCurrencyParams.symbol);

        expect(currency.symbol).toBe(validCurrencyParams.symbol);
        expect(currency.label).toBe(validCurrencyParams.label);
    });

    it("Deve ocorrer uma excessão quando os parametros forem inválidos", () => {
        expect(CurrencyService.create(invalidCurrencyParams))
        .rejects
        .toThrow('Currency validation failed: symbol: Path `symbol` is required');
    });

    it("Deve retornar false quando remover uma moeda", async () => {
        await CurrencyService.create(validCurrencyParams);
        await CurrencyService.delete(validCurrencyParams.symbol)
        const currency = await CurrencyService.findBySymbol(validCurrencyParams.symbol);

        expect(currency).toBeFalsy();
    });

    it("Deve retornar uma lista de moedas", async () => {
        await CurrencyService.createMany(listCurrencyParams);
        const symbols = await CurrencyService.allSymbols();

        expect(symbols).toEqual(['USD', 'BRL', 'EUR', 'BTC', 'ETH']);
    });

    it("Deve retornar uma lista de moedas exceto a moeda base", async () => {
        await CurrencyService.createMany(listCurrencyParams);
        const symbols = await CurrencyService.allSymbols('BRL');

        expect(symbols).toEqual(['USD', 'EUR', 'BTC', 'ETH']);
    });
});

const validCurrencyParams = {
    symbol: 'BRL',
    label: 'Brazilian Real'
}

const invalidCurrencyParams = {
    symbol: null,
    label: 'Brazilian Real'
}

const listCurrencyParams = [
    {
        symbol: 'USD',
        label: 'United States dollar'
    },
    {
        symbol: 'BRL',
        label: 'Brazilian Real'
    },
    {
        symbol: 'EUR',
        label: 'European Euro'
    },
    {
        symbol: 'BTC',
        label: 'Bitcoin'
    },
    {
        symbol: 'ETH',
        label: 'Ethereum'
    }
]