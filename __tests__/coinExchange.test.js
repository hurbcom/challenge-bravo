require('dotenv').config();
const cache = require('../src/db/cache');
const coinExchangeService =  require('../src/service/coinExchangeService');
const db = require('../src/db/database');

describe("CurrencyExchange", () => {
    beforeAll(async () => await db.dbConnect('api', 'test'));
    afterEach(async () => {
        await db.dbClear();
        await cache.flushallAsync();
    });
    afterAll(async () => {
        await db.dbClose(true);
        cache.close(true);
    });

    it("Deve retornar objeto com a taxa de cambio quando os parametros forem válidos", async () => {
        await coinExchangeService.create(validCurrencyExchangeParams);
        const currencyExchange = await coinExchangeService.findByBaseSymbol(validCurrencyExchangeParams.baseSymbol);

        expect(currencyExchange.baseSymbol).toBe(validCurrencyExchangeParams.baseSymbol);
        expect(currencyExchange.rates.length).toEqual(4);
        expect(Date.parse(currencyExchange.createdAt)).toBe(validCurrencyExchangeParams.createdAt);
    });

    it("Deve retornar último objeto com a taxa de cambio criado quando os parametros forem válidos", async () => {
        await coinExchangeService.createMany(listCurrencyExchangeParams);
        const currencyExchange = await coinExchangeService.findByBaseSymbol(validCurrencyExchangeParams.baseSymbol);
        const lastCurrencyExchangeParam = listCurrencyExchangeParams.pop();

        expect(Date.parse(currencyExchange.createdAt)).toBe(lastCurrencyExchangeParam.createdAt);
    });

    it("Deve ocorrer uma excessão quando os parametros forem inválidos", () => {
        expect(coinExchangeService.create(invalidCurrencyExchangeParams))
        .rejects
        .toThrow('CurrencyExchange validation failed: baseSymbol: Path `baseSymbol` is required');
    });

    it("Deve ser falso quando remover a taxa de cambio", async () => {
        await coinExchangeService.create(validCurrencyExchangeParams);
        await coinExchangeService.delete(validCurrencyExchangeParams.baseSymbol)
        const currencyExchange = await coinExchangeService.findByBaseSymbol(validCurrencyExchangeParams.baseSymbol);

        expect(currencyExchange).toBeFalsy();
    });

    it("Deve retornar o novo valor da moeda convertida quando os parametros forem válidos", async () => {
        await coinExchangeService.createMany(listCurrencyExchangeParams);
        const amount = 123.45;
        const currencyConverted = await coinExchangeService.converter('USD', 'BRL', amount);
        expect(currencyConverted.amount).toEqual("665.3955");
    });

    it("Deve retornar zero quando os parametros forem inválidos", async () => {
        await coinExchangeService.createMany(listCurrencyExchangeParams);
        const amount = 123.45;
        const currencyConverted = await coinExchangeService.converter('FOO', 'BRL', amount);
        expect(currencyConverted.amount).toEqual("0.00");
    });
});

const validCurrencyExchangeParams = {
    baseSymbol: 'USD',
    rates: [
        { to: 'BRL', rate: 5.39 },
        { to: 'EUR', rate: 0.8299 },
        { to: 'BTC', rate: 0.00002851 },
        { to: 'ETH', rate: 0.000837 },
    ],
    createdAt: Date.parse('2021-03-20')
}

const invalidCurrencyExchangeParams = {
    baseSymbol: null,
    rates: [
        { to: 'BRL', rate: 5.39 },
        { to: 'EUR', rate: 0.8299 },
        { to: 'BTC', rate: 0.00002851 },
        { to: 'ETH', rate: 0.000837 },
    ],
    createdAt: new Date()
}

const listCurrencyExchangeParams = [
    {
        baseSymbol: 'USD',
        rates: [
            { to: 'BRL', rate: 5.43 },
            { to: 'EUR', rate: 0.8199 },
            { to: 'BTC', rate: 0.00002951 },
            { to: 'ETH', rate: 0.000847 },
        ],
        createdAt: Date.parse('2021-03-20')
    },
    {
        baseSymbol: 'USD',
        rates: [
            { to: 'BRL', rate: 5.39 },
            { to: 'EUR', rate: 0.8299 },
            { to: 'BTC', rate: 0.00003851 },
            { to: 'ETH', rate: 0.000858 },
        ],
        createdAt: Date.parse('2021-03-21')
    },
    {
        baseSymbol: 'USD',
        rates: [
            { to: 'BRL', rate: 5.30 },
            { to: 'EUR', rate: 0.8398 },
            { to: 'BTC', rate: 0.00002091 },
            { to: 'ETH', rate: 0.000908 },
        ],
        createdAt: Date.parse('2021-03-22')
    }
];