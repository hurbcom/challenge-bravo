jest.mock('redis')
const { app } = require('../src/app')
const request = require('supertest')
const redis = require('redis')

const mock = {
    get: jest.fn().mockResolvedValue('OK')
}

beforeAll(()=>{
    redis.createClient.mockImplementation(()=>{
        return mock
    })
    global.client = redis.createClient()
})

beforeEach(()=>{
    global.HandleError.mockClear()
    mock.get.mockClear()
})

test('It should request list coins with success.', async () => {

    const expected = {
        "error": false,
        "status": 200,
        "date": new Date().toISOString(),
        "message": "Calculado com sucesso",
        "data": {
            "quoteFrom": 1.0697,
            "quoteTo": 0.2073,
            "valueCalculate": 516.0154365653642,
            "type": "buy"
        }
    }

    const mockRedisFrom = JSON.stringify({ "sale": "1.0701", "buy": "1.0697" })
    const mockRedisTo = JSON.stringify({ "sale": "0.2073", "buy": "0.2073" })

    mock.get.mockResolvedValueOnce(mockRedisFrom)
    mock.get.mockResolvedValueOnce(mockRedisTo)


    await request(app)
        .get('/api/converter')
        .query('from=EUR&to=BRL&value=100.00&type=buy')
        .expect(200)
        .then(response => {
            expect(response.body).toEqual(expected)
            expect(mock.get).toHaveBeenCalledTimes(2)
            expect(mock.get).toHaveBeenNthCalledWith(1, "EUR")
            expect(mock.get).toHaveBeenNthCalledWith(2, "BRL")
        })
})

test('It should request list coins with success.', async () => {

    const expected = {
        "error": true,
        "status": 404,
        "date": new Date().toISOString(),
        "message": "Moeda não disponivel para conversão",
        "data": {"coinCode": "EURA"}
    }

    const mockRedisFrom = null
    const mockRedisTo = JSON.stringify({ "sale": "0.2073", "buy": "0.2073" })

    mock.get.mockResolvedValueOnce(mockRedisFrom)
    mock.get.mockResolvedValueOnce(mockRedisTo)


    await request(app)
        .get('/api/converter')
        .query('from=EURA&to=BRL&value=100.00&type=buy')
        .expect(404)
        .then(response => {
            expect(response.body).toEqual(expected)
            expect(mock.get).toHaveBeenCalledTimes(2)
            expect(mock.get).toHaveBeenNthCalledWith(1, "EURA")
            expect(mock.get).toHaveBeenNthCalledWith(2, "BRL")
        })
})