jest.mock('../../src/redis/quoteCache.js')
jest.mock('../../src/repository/coin.js')
jest.mock('../../src/api/quote.js')
const mock = require('../mock/repository/coin.mock')
const repositoryCoin = require('../../src/repository/coin')
const redis = require('../../src/redis/quoteCache')
const apiQuote = require('../../src/api/quote')
const controllerUpdateQuote = require('../../src/controller/updateQuotation')

beforeEach(() => {
    global.HandleError.mockClear()
    repositoryCoin.getAllCoin.mockReset()
    repositoryCoin.updateQuoteValue.mockReset()
    apiQuote.getQuoteUpdated.mockReset()
    redis.register.mockReset()
})


describe('It should test function manuel', () => {

    test('It should update quote manuel with success', async () => {

        const coinCode = mock.MOCK_COIN().coinCode
        const quoteToRedis = mock.MOCK_COIN().quote
        const quoteToUpdate = {
            coinCode: coinCode,
            buy: quoteToRedis.buy,
            sale: quoteToRedis.sale
        }

        repositoryCoin.updateQuoteValue.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
        redis.register.mockResolvedValueOnce('OK')

        const spyRep = jest.spyOn(repositoryCoin, 'updateQuoteValue')
        const spyRedis = jest.spyOn(redis, 'register')

        const expected = { "data": undefined, "date": new Date().toISOString(), "error": false, "message": "Cotação atualizada manualmente", "status": 200 }

        const received = controllerUpdateQuote.manual(quoteToUpdate)

        await expect(received).resolves.toEqual(expected)
        expect(spyRep).toHaveBeenCalledTimes(1)
        expect(spyRep).toHaveBeenCalledWith(quoteToUpdate)
        expect(spyRedis).toHaveBeenCalledTimes(1)
        expect(spyRedis).toHaveBeenCalledWith(coinCode, quoteToRedis)

    })
})

describe('It should test function byAPI', () => {

    test('It should update quote by API with success.', async () => {

        const mock_getAll = [
            {
                "coinName": "bitcoin",
                "coinCode": "BTC",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            },
            {
                "coinName": "Real",
                "coinCode": "BRL",
                "type": "API",
                "quote": {
                    "sale": "0.2079",
                    "buy": "0.2079"
                }
            }
        ]

        const mock_api_btc = { "sale": "29.242", "buy": "29.241", "coinCode": "BTC" }
        const mock_api_brl = { "sale": "0.2074", "buy": "0.2075", "coinCode": "BRL" }


        const mock_redis_btc = Object.assign({}, mock_api_btc)
        delete mock_redis_btc.coinCode
        const mock_redis_brl = Object.assign({}, mock_api_brl)
        delete mock_redis_brl.coinCode

        const expected = { "data": undefined, "date": new Date().toISOString(), "error": false, "message": "Cotação atualizada", "status": 200 }

        repositoryCoin.getAllCoin.mockResolvedValueOnce(mock_getAll)
        apiQuote.getQuoteUpdated.mockResolvedValueOnce([mock_api_btc, mock_api_brl])
        repositoryCoin.updateQuoteValue.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
        repositoryCoin.updateQuoteValue.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
        redis.register.mockResolvedValueOnce('OK')
        redis.register.mockResolvedValueOnce('OK')

        const spyRepGet = jest.spyOn(repositoryCoin, 'getAllCoin')
        const spyApi = jest.spyOn(apiQuote, 'getQuoteUpdated')
        const spyRepUpd = jest.spyOn(repositoryCoin, 'updateQuoteValue')
        const spyRedis = jest.spyOn(redis, 'register')

        const received = controllerUpdateQuote.byAPI()

        await expect(received).resolves.toEqual(expected)
        expect(spyRepGet).toHaveBeenCalledTimes(1)
        expect(spyRepGet).toHaveBeenNthCalledWith(1, 'API')
        expect(spyApi).toHaveBeenCalledTimes(1)
        expect(spyApi).toHaveBeenNthCalledWith(1, ["BTC-USD", "BRL-USD"])
        expect(spyRepUpd).toHaveBeenCalledTimes(2)
        expect(spyRepUpd).toHaveBeenNthCalledWith(1, mock_api_btc)
        expect(spyRepUpd).toHaveBeenNthCalledWith(2, mock_api_brl)
        expect(spyRedis).toHaveBeenCalledTimes(2)
        expect(spyRedis).toHaveBeenNthCalledWith(1, mock_api_btc.coinCode, mock_redis_btc)
        expect(spyRedis).toHaveBeenNthCalledWith(2, mock_api_brl.coinCode, mock_redis_brl)

    })


    test('It should update quote by API with Error.', async () => {

        const mock_getAll = [
            {
                "coinName": "bitcoin",
                "coinCode": "BTC",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            },
            {
                "coinName": "Real",
                "coinCode": "BRL",
                "type": "API",
                "quote": {
                    "sale": "0.2079",
                    "buy": "0.2079"
                }
            }
        ]

        repositoryCoin.getAllCoin.mockResolvedValueOnce(mock_getAll)
        apiQuote.getQuoteUpdated.mockRejectedValueOnce(mock.MOCK_HANDLE_ERROR())
        repositoryCoin.updateQuoteValue.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
        redis.register.mockRejectedValueOnce('OK')

        const spyRepGet = jest.spyOn(repositoryCoin, 'getAllCoin')
        const spyApi = jest.spyOn(apiQuote, 'getQuoteUpdated')
        const spyRepUpd = jest.spyOn(repositoryCoin, 'updateQuoteValue')
        const spyRedis = jest.spyOn(redis, 'register')

        const received = controllerUpdateQuote.byAPI()

        await expect(received).rejects.toEqual(new Error('Moeda não encontrada'))
        expect(spyRepGet).toHaveBeenCalledTimes(1)
        expect(spyRepGet).toHaveBeenNthCalledWith(1, 'API')
        expect(spyApi).toHaveBeenCalledTimes(1)
        expect(spyApi).toHaveBeenNthCalledWith(1, ["BTC-USD", "BRL-USD"])
        expect(spyRepUpd).toHaveBeenCalledTimes(0)
        expect(spyRedis).toHaveBeenCalledTimes(0)
    })
})

describe('It should test function initialLoadInRedis', () => {
    test('It should update quote in initial load in redis with success.', async () => {

        const mock_getAll_api = [
            {
                "coinName": "bitcoin",
                "coinCode": "BTC",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            },
            {
                "coinName": "Real",
                "coinCode": "BRL",
                "type": "API",
                "quote": {
                    "sale": "0.2079",
                    "buy": "0.2079"
                }
            }
        ]

        const mock_getAll_fixe = [
            {
                "coinName": "HURB coins",
                "coinCode": "HURB",
                "type": "FIXE",
                "quote": {
                    "buy": "1.0",
                    "sale": "0.9"
                }
            }
        ]

        const mock_api_btc = { "sale": "29.242", "buy": "29.241", "coinCode": "BTC" }
        const mock_api_brl = { "sale": "0.2074", "buy": "0.2075", "coinCode": "BRL" }


        const mock_redis_btc = Object.assign({}, mock_api_btc)
        delete mock_redis_btc.coinCode
        const mock_redis_brl = Object.assign({}, mock_api_brl)
        delete mock_redis_brl.coinCode
        const coinCodeHurb = 'HURB'
        const mock_redis_hurb = { "buy": "1.0", "sale": "0.9" }

        const expected = [
            { "status": "fulfilled", "value": "Carga inicial das moedas do typo api no banco de cache" },
            { "status": "fulfilled", "value": "Carga inicial das moedas do typo fixe no banco de cache" }
        ]

        repositoryCoin.getAllCoin.mockResolvedValueOnce(mock_getAll_api)
        repositoryCoin.getAllCoin.mockImplementationOnce(() => {
            return new Promise((resolve) => { setTimeout(resolve, 250, mock_getAll_fixe) })
        })
        apiQuote.getQuoteUpdated.mockResolvedValueOnce([mock_api_btc, mock_api_brl])
        repositoryCoin.updateQuoteValue.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
        repositoryCoin.updateQuoteValue.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
        redis.register.mockResolvedValueOnce('OK')
        redis.register.mockResolvedValueOnce('OK')
        redis.register.mockResolvedValueOnce('OK')

        const spyRepGet = jest.spyOn(repositoryCoin, 'getAllCoin')
        const spyApi = jest.spyOn(apiQuote, 'getQuoteUpdated')
        const spyRepUpd = jest.spyOn(repositoryCoin, 'updateQuoteValue')
        const spyRedis = jest.spyOn(redis, 'register')

        const received = controllerUpdateQuote.initialLoadInRedis()

        await expect(received).resolves.toEqual(expected)
        expect(spyRepGet).toHaveBeenCalledTimes(2)
        expect(spyRepGet).toHaveBeenNthCalledWith(1, 'API')
        expect(spyRepGet).toHaveBeenNthCalledWith(2, 'FIXE')
        expect(spyApi).toHaveBeenCalledTimes(1)
        expect(spyApi).toHaveBeenNthCalledWith(1, ["BTC-USD", "BRL-USD"])
        expect(spyRepUpd).toHaveBeenCalledTimes(2)
        expect(spyRepUpd).toHaveBeenNthCalledWith(1, mock_api_btc)
        expect(spyRepUpd).toHaveBeenNthCalledWith(2, mock_api_brl)
        expect(spyRedis).toHaveBeenCalledTimes(3)
        expect(spyRedis).toHaveBeenNthCalledWith(1, mock_api_btc.coinCode, mock_redis_btc)
        expect(spyRedis).toHaveBeenNthCalledWith(2, mock_api_brl.coinCode, mock_redis_brl)
        expect(spyRedis).toHaveBeenNthCalledWith(3, coinCodeHurb, mock_redis_hurb)
    })


    test('It should update quote in initial load in redis with fail because mongo return empty.', async () => {

        const expected = [
            { "status": "fulfilled", "value": "Não há moeda do tipo api para carregar no banco de cache" },
            { "status": "fulfilled", "value": "Não há moeda do tipo fixe para carregar no banco de cache" }
        ]

        repositoryCoin.getAllCoin.mockResolvedValueOnce([])
        repositoryCoin.getAllCoin.mockResolvedValueOnce([])

        apiQuote.getQuoteUpdated.mockRejectedValueOnce()
        repositoryCoin.updateQuoteValue.mockRejectedValueOnce()
        repositoryCoin.updateQuoteValue.mockRejectedValueOnce()
        redis.register.mockRejectedValueOnce()
        redis.register.mockRejectedValueOnce()
        redis.register.mockRejectedValueOnce()

        const spyRepGet = jest.spyOn(repositoryCoin, 'getAllCoin')
        const spyApi = jest.spyOn(apiQuote, 'getQuoteUpdated')
        const spyRepUpd = jest.spyOn(repositoryCoin, 'updateQuoteValue')
        const spyRedis = jest.spyOn(redis, 'register')

        const received = controllerUpdateQuote.initialLoadInRedis()

        await expect(received).resolves.toEqual(expected)
        expect(spyRepGet).toHaveBeenCalledTimes(2)
        expect(spyRepGet).toHaveBeenNthCalledWith(1, 'API')
        expect(spyRepGet).toHaveBeenNthCalledWith(2, 'FIXE')
        expect(spyApi).toHaveBeenCalledTimes(0)
        expect(spyRepUpd).toHaveBeenCalledTimes(0)
        expect(spyRedis).toHaveBeenCalledTimes(0)
    })


    test('It should update quote in initial load in redis with fail because mongo return empty.', async () => {

        const mock_getAll_api = [
            {
                "coinName": "bitcoin",
                "coinCode": "BTC",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            },
            {
                "coinName": "Real",
                "coinCode": "BRL",
                "type": "API",
                "quote": {
                    "sale": "0.2079",
                    "buy": "0.2079"
                }
            }
        ]

        const mock_getAll_fixe = [
            {
                "coinName": "HURB coins",
                "coinCode": "HURB",
                "type": "FIXE",
                "quote": {
                    "buy": "1.0",
                    "sale": "0.9"
                }
            }
        ]

        const mock_api_btc = { "sale": "29.242", "buy": "29.241", "coinCode": "BTC" }
        const mock_api_brl = { "sale": "0.2074", "buy": "0.2075", "coinCode": "BRL" }


        const mock_redis_btc = Object.assign({}, mock_api_btc)
        delete mock_redis_btc.coinCode
        const mock_redis_brl = Object.assign({}, mock_api_brl)
        delete mock_redis_brl.coinCode
        const coinCodeHurb = 'HURB'
        const mock_redis_hurb = { "buy": "1.0", "sale": "0.9" }

        const expected = [
            {"reason": new Error("Error ao da carga inicial das cotações do tipo api: TIMEOUT"), "status": "rejected"},
            {"reason": new Error("Error ao da carga inicial das cotações do tipo fixe: TIMEOUT"), "status": "rejected"}
        ]

        repositoryCoin.getAllCoin.mockResolvedValueOnce(mock_getAll_api)
        repositoryCoin.getAllCoin.mockImplementationOnce(() => {
            return new Promise((resolve) => { setTimeout(resolve, 250, mock_getAll_fixe) })
        })

        apiQuote.getQuoteUpdated.mockRejectedValueOnce(new Error('TIMEOUT'))
        repositoryCoin.updateQuoteValue.mockRejectedValueOnce()
        repositoryCoin.updateQuoteValue.mockRejectedValueOnce()
        redis.register.mockRejectedValueOnce(new Error('TIMEOUT'))
        redis.register.mockRejectedValueOnce()
        redis.register.mockRejectedValueOnce()

        const spyRepGet = jest.spyOn(repositoryCoin, 'getAllCoin')
        const spyApi = jest.spyOn(apiQuote, 'getQuoteUpdated')
        const spyRepUpd = jest.spyOn(repositoryCoin, 'updateQuoteValue')
        const spyRedis = jest.spyOn(redis, 'register')

        const received = controllerUpdateQuote.initialLoadInRedis()
        await expect(received).resolves.toEqual(expected)
        expect(spyRepGet).toHaveBeenCalledTimes(2)
        expect(spyRepGet).toHaveBeenNthCalledWith(1, 'API')
        expect(spyRepGet).toHaveBeenNthCalledWith(2, 'FIXE')
        expect(spyApi).toHaveBeenCalledTimes(1)
        expect(spyRepUpd).toHaveBeenCalledTimes(0)
        expect(spyRedis).toHaveBeenCalledTimes(1)
    })
})