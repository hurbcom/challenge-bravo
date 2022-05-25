jest.mock('../../src/redis/quoteCache.js')
jest.mock('../../src/repository/coin.js')
jest.mock('../../src/api/quote.js')
const mock = require('../mock/repository/coin.mock')
const repositoryCoin = require('../../src/repository/coin')
const redis = require('../../src/redis/quoteCache')
const apiQuote = require('../../src/api/quote')
const controllerUpdateQuote = require('../../src/controller/updateQuotation')

const consoleError = console.error

beforeAll(() => {
    console.error = jest.fn()
    console.error.mockImplementation((...args) => {
        consoleError(...args)
    })
})

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

        const expected = {"data": undefined, "date": new Date().toISOString(), "error": false, "message": "Cotação atualizada manualmente", "status": 200}

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

        await expect(received).resolves.toEqual(["OK", "OK"])
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

        console.error.mockImplementationOnce((error) => {
            const errorHandle = mock.MOCK_HANDLE_ERROR()
            expect(error.message).toEqual(errorHandle.message)
            expect(error.status).toEqual(errorHandle.status)
            expect(error.data).toEqual(errorHandle.data)
        })

        repositoryCoin.getAllCoin.mockResolvedValueOnce(mock_getAll)
        apiQuote.getQuoteUpdated.mockRejectedValueOnce(mock.MOCK_HANDLE_ERROR())
        repositoryCoin.updateQuoteValue.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
        redis.register.mockRejectedValueOnce('OK')

        const spyRepGet = jest.spyOn(repositoryCoin, 'getAllCoin')
        const spyApi = jest.spyOn(apiQuote, 'getQuoteUpdated')
        const spyRepUpd = jest.spyOn(repositoryCoin, 'updateQuoteValue')
        const spyRedis = jest.spyOn(redis, 'register')
        const spyError = jest.spyOn(console, 'error')


        const received = controllerUpdateQuote.byAPI()

        await expect(received).resolves.toEqual()
        expect(spyRepGet).toHaveBeenCalledTimes(1)
        expect(spyRepGet).toHaveBeenNthCalledWith(1, 'API')
        expect(spyApi).toHaveBeenCalledTimes(1)
        expect(spyApi).toHaveBeenNthCalledWith(1, ["BTC-USD", "BRL-USD"])
        expect(spyRepUpd).toHaveBeenCalledTimes(0)
        expect(spyRedis).toHaveBeenCalledTimes(0)
        expect(spyError).toHaveBeenCalledTimes(1)
        expect(spyError).toHaveBeenNthCalledWith(1, mock.MOCK_HANDLE_ERROR())
    })
})