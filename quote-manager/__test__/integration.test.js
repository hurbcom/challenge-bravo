const CONST = require('../src/properties')
const nock = require('nock')

jest.mock('redis')
const redis = require('redis')

require('../src/model/coin')
const { models } = require('mongoose')
const mock = require('./mock/repository/coin.mock')

const { app } = require('../src/app')
const request = require('supertest')

const mock_redis = {
    set: jest.fn().mockResolvedValue('OK')
}

beforeAll(() => {
    redis.createClient.mockImplementation(() => {
        return mock_redis
    })
    global.client = redis.createClient()
    models.CoinModel.find = jest.fn()
    models.CoinModel.findOne = jest.fn()
    models.CoinModel.prototype.save = jest.fn()
    models.CoinModel.updateOne = jest.fn()
    models.CoinModel.deleteOne = jest.fn()
})

beforeEach(() => {
    nock.cleanAll()
    mock_redis.set.mockReset()
    global.HandleError.mockClear()
    jest.clearAllMocks();
    models.CoinModel.prototype.save.mockReset()
    models.CoinModel.findOne.mockReset()
    models.CoinModel.find.mockReset()
    models.CoinModel.updateOne.mockReset()
    models.CoinModel.deleteOne.mockReset()
})

afterAll(() => {
    if (!nock.isActive()) {
        nock.activate()
    }
})

describe('It should test find coin.', () => {
    describe('It should test router GET api/coin/list.', () => {
        test('It should request list coins with success.', async () => {

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

            const mockResponse = { "data": ["BTC", "BRL"], "date": new Date().toISOString(), "error": false, "message": "Lista de moedas", "status": 200 }

            models.CoinModel.find.mockResolvedValueOnce(mock_getAll)

            await request(app)
                .get('/api/coin/list')
                .query('type=API')
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })

        test('It should request list coins with fail.', async () => {

            const mock_result = () => {
                return Promise.reject(mock.MOCK_ERROR_MONGO())
            }

            const mockResponse = { "data": undefined, "date": new Date().toISOString(), "error": true, "message": "Algum error quando foi salvar", "status": 500 }

            models.CoinModel.find.mockImplementationOnce(mock_result)

            await request(app)
                .get('/api/coin/list')
                .query('type=API')
                .expect(500)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })
    })

    describe('It should test router GET api/coin/:code.', () => {
        test('It should request find coin with success.', async () => {

            const mock_getCoin = {
                "coinName": "bitcoin",
                "coinCode": "BTC",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            }

            const coinCode = mock_getCoin.coinCode

            const mockResponse = { "data": mock_getCoin, "date": new Date().toISOString(), "error": false, "message": "Moeda encontrada", "status": 200 }

            models.CoinModel.findOne.mockResolvedValueOnce(mock_getCoin)

            await request(app)
                .get('/api/coin/' + coinCode)
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })

        test('It should request find coin with fail.', async () => {

            const coinCode = "BTCA"

            const mockResponse = { "data": { "coinCode": coinCode }, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404 }

            models.CoinModel.findOne.mockResolvedValueOnce(null)

            await request(app)
                .get('/api/coin/' + coinCode)
                .expect(404)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })
    })

})

describe('It should test CRUD coin.', () => {


    describe('It should test router add api/coin/.', () => {
        test('It should request save coin with success.', async () => {

            const body = {
                "coinName": "bitcoin",
                "coinCode": "BTC",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            }

            const mockResponse = { "data": undefined, "date": new Date().toISOString(), "error": false, "message": "Moeda Salvo com sucesso", "status": 201 }

            models.CoinModel.prototype.save.mockResolvedValueOnce(mock.MOCK_COIN_MODEL())

            await request(app)
                .post('/api/coin/')
                .send(body)
                .expect(201)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })

        test('It should request save coin with fail.', async () => {

            const mock_result = () => {
                return Promise.reject(mock.MOCK_ERROR_MONGO())
            }

            const body = {
                "coinName": "bitcoin",
                "coinCode": "BTC",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            }

            const mockResponse = { "data": undefined, "date": new Date().toISOString(), "error": true, "message": "MongoError: Erro ao tentar salvar a moeda: Algum error quando foi salvar", "status": 500 }

            models.CoinModel.prototype.save.mockImplementationOnce(mock_result)

            await request(app)
                .post('/api/coin/')
                .send(body)
                .expect(500)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })
    })

    describe('It should test router PUT api/coin/:code.', () => {
        test('It should request update coin with success.', async () => {

            const body = {
                "coinName": "bitcoin",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            }

            const coinCode = "BTC"

            const mockResponse = { "data": undefined, "date": new Date().toISOString(), "error": false, "message": "Moeda Atualizada com sucesso", "status": 200 }

            models.CoinModel.findOne.mockResolvedValueOnce(mock.MOCK_COIN_MODEL())
            models.CoinModel.updateOne.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())

            await request(app)
                .put('/api/coin/' + coinCode)
                .send(body)
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })

        test('It should request update coin with fail.', async () => {

            const body = {
                "coinName": "bitcoin",
                "type": "API",
                "quote": {
                    "sale": "30",
                    "buy": "30.2"
                }
            }

            const coinCode = "BTCA"

            const mockResponse = { "data": { "coinCode": coinCode }, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404 }

            models.CoinModel.findOne.mockResolvedValueOnce(null)
            models.CoinModel.updateOne.mockResolvedValueOnce('não deveria rodar')

            await request(app)
                .put('/api/coin/' + coinCode)
                .send(body)
                .expect(404)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })
    })


    describe('It should test router DELETE api/coin/:code.', () => {
        test('It should request update coin with success.', async () => {

            const coinCode = "BTC"

            const mockResponse = { "data": undefined, "date": new Date().toISOString(), "error": false, "message": "Moeda Removida com sucesso", "status": 200 }

            mock_redis.set.mockResolvedValueOnce('OK')
            models.CoinModel.findOne.mockResolvedValueOnce(mock.MOCK_COIN_MODEL())
            models.CoinModel.updateOne.mockResolvedValueOnce(mock.MOCK_RETURN_DELETE())

            await request(app)
                .delete('/api/coin/' + coinCode)
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })

        test('It should request update coin with fail.', async () => {

            const coinCode = "BTCA"

            const mockResponse = { "data": { "coinCode": coinCode }, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404 }

            mock_redis.set.mockResolvedValueOnce('OK')
            models.CoinModel.findOne.mockResolvedValueOnce(null)
            models.CoinModel.updateOne.mockResolvedValueOnce('não deveria rodar')

            await request(app)
                .delete('/api/coin/' + coinCode)
                .expect(404)
                .then(response => {
                    expect(response.body).toEqual(mockResponse)
                })
        })
    })


})

describe('It should test update quote.', () => {

    describe('It should test update quote manually.', () => {
        test('It should test request from router responsibility update Quote manually with success.', async () => {

            const mock_response = { "data": undefined, "date": new Date().toISOString(), "error": false, "message": "Cotação atualizada manualmente", "status": 200 }

            models.CoinModel.findOne.mockResolvedValueOnce(mock.MOCK_COIN_MODEL())
            models.CoinModel.updateOne.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
            mock_redis.set.mockResolvedValueOnce('OK')

            const body = { coin: 'BTC', buy: "20.92", sale: "20.67" }

            await request(app)
                .put('/api/quote/BTC')
                .send(body)
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(mock_response)
                })
        })

        test('It should test request from router responsibility update Quote manually with fail.', async () => {

            const mock_response = { "data": { "coinCode": "BTCA" }, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404 }

            models.CoinModel.findOne.mockResolvedValueOnce(null)
            models.CoinModel.updateOne.mockRejectedValueOnce('Não deveria ter executado updateOne')
            mock_redis.set.mockRejectedValueOnce('Não deveria ter executado redis.set')

            const body = { coin: 'BTCA', buy: "20.92", sale: "20.67" }

            await request(app)
                .put('/api/quote/BTCA')
                .send(body)
                .expect(404)
                .then(response => {
                    expect(response.body).toEqual(mock_response)
                })
        })
    })

    describe('It should test update quote API.', () => {

        test('It should test request from router responsibility update Quote API.', async () => {
            const mock_getAll = [
                {
                    "coinName": "Euro",
                    "coinCode": "EUR",
                    "type": "API",
                    "quote": {
                        "sale": "1.0735",
                        "buy": "1.0734"
                    }
                },
                {
                    "coinName": "bitcoin",
                    "coinCode": "BTC",
                    "type": "API",
                    "quote": {
                        "sale": "30",
                        "buy": "30.2"
                    }
                },
            ]

            const mock_coins = ["EUR-USD", "BTC-USD"]

            const mock_response_api = {
                "EURUSD": {
                    "code": "EUR",
                    "codein": "USD",
                    "name": "Euro/Dólar Americano",
                    "high": "1.0599",
                    "low": "1.0533",
                    "varBid": "-0.0024",
                    "pctChange": "-0.23",
                    "bid": "1.056",
                    "ask": "1.0564",
                    "timestamp": "1653080390",
                    "create_date": "2022-05-20 17:59:50"
                },
                "BTCUSD": {
                    "code": "BTC",
                    "codein": "USD",
                    "name": "Bitcoin/Dólar Americano",
                    "high": "30.546",
                    "low": "28.702",
                    "varBid": "-861.6",
                    "pctChange": "-2.86",
                    "bid": "29.241",
                    "ask": "29.242",
                    "timestamp": "1653109577",
                    "create_date": "2022-05-21 02:06:17"
                }
            }

            models.CoinModel.find.mockResolvedValueOnce(mock_getAll)

            nock(CONST.API_QUOTE_URL)
                .get(CONST.API_QUOTE_LAST_PATH + mock_coins.join(','))
                .reply(200, mock_response_api)

            const mock_return_find = (query, project) => {
                const coin = mock_getAll.find(el => el.coinCode == query.coinCode)
                return Promise.resolve(coin)
            }

            models.CoinModel.findOne.mockImplementationOnce(mock_return_find)
            models.CoinModel.findOne.mockImplementationOnce(mock_return_find)

            models.CoinModel.updateOne.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())
            models.CoinModel.updateOne.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())

            global.client.set.mockResolvedValueOnce('OK')
            global.client.set.mockResolvedValueOnce('OK')



            await request(app)
                .put('/api/quote')
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual({"date": new Date().toISOString(), "error": false, "message": "Cotação atualizada", "status": 200})
                })
        })


        test('It should test request from router responsibility update Quote API but not find coins.', async () => {

            const expected = {"data": undefined, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404}

            models.CoinModel.find.mockResolvedValueOnce([])

            nock(CONST.API_QUOTE_URL)
                .get(CONST.API_QUOTE_LAST_PATH )
                .reply(500, 'não deveria ta aqui - nock')


            models.CoinModel.findOne.mockRejectedValueOnce('não deveria ta aqui - findOne')

            models.CoinModel.updateOne.mockRejectedValueOnce('não deveria ta aqui - updateOne')

            global.client.set.mockRejectedValueOnce('não deveria ta aqui - redis')

            await request(app)
                .put('/api/quote')
                .expect(404)
                .then(response => {
                    expect(response.body).toEqual(expected)
                })
        })
    })

})