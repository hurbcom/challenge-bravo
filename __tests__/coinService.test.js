/* eslint-disable no-return-await */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable indent */
require('dotenv').config();
const db = require('../src/db/database');
const CoinService = require('../src/service/coinService');

describe("Currency", () => {
    beforeAll(async () => await db.dbConnect('api', 'test'));
    afterEach(async () => await db.dbClear());
    afterAll(async () => await db.dbClose(true));

    it("Deve retornar uma moeda quando os parametros forem válidos", async () => {
        await CoinService.create(validCurrencyParams);
        const currency = await CoinService.findBySymbol(validCurrencyParams.to);

        expect(currency.to).toBe(validCurrencyParams.to);
        expect(currency.label).toBe(validCurrencyParams.label);
    });

    it("Deve ocorrer uma excessão quando os parametros forem inválidos", () => {
        expect(CoinService.create(invalidCurrencyParams))
        .rejects
        .toThrow('Currency validation failed: to: Path `to` is required');
    });

    it("Deve retornar false quando remover uma moeda", async () => {
        await CoinService.create(validCurrencyParams);
        await CoinService.delete(validCurrencyParams.to)
        const currency = await CoinService.findBySymbol(validCurrencyParams.to);

        expect(currency).toBeFalsy();
    });

    it("Deve retornar uma lista de moedas", async () => {
        await CoinService.createMany(base);
        const symbols = await CoinService.allSymbols();

        expect(symbols).toEqual(['USD', 'BRL', 'EUR', 'BTC', 'ETH']);
    });

    it("Deve retornar uma lista de moedas exceto a moeda base", async () => {
        await CoinService.createMany(base);
        const symbols = await CoinService.allSymbols('BRL');

        expect(symbols).toEqual(['USD', 'EUR', 'BTC', 'ETH']);
    });
});

const validCurrencyParams = {
    to: 'BRL',
    label: 'Brazilian Real'
}

const invalidCurrencyParams = {
    to: null,
    label: 'Brazilian Real'
}

const base = [
    {
        to: 'USD',
        label: 'United States dollar'
    },
    {
        to: 'BRL',
        label: 'Brazilian Real'
    },
    {
        to: 'EUR',
        label: 'European Euro'
    },
    {
        to: 'BTC',
        label: 'Bitcoin'
    },
    {
        to: 'ETH',
        label: 'Ethereum'
    }
]