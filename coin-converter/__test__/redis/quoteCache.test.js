jest.mock('redis')
const quoteCache = require('../../src/redis/quoteCache')
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


test('It should read quotations in redis with success.', async ()=>{
    const key = 'BTC'
    const expected = { "ask": "29.242", "bid": "29.241" }

    const mock_redis_get = JSON.stringify(expected)

    mock.get.mockResolvedValue(mock_redis_get)

    const result = quoteCache.read(key)
    
    await expect(result).resolves.toEqual(expected)
    expect(mock.get).toHaveBeenCalledTimes(1)
    expect(mock.get).toHaveBeenCalledWith(key)
})

test('It should read string in redis with success.', ()=>{
    const key = 'BTC'
    const expected = "Teste valor alguma coisa"
    const mock_redis_get = "\"Teste valor alguma coisa\""

    mock.get.mockResolvedValue(mock_redis_get)

    const result = quoteCache.read(key)
    
    expect(result).resolves.toEqual(expected)
    expect(mock.get).toHaveBeenCalledTimes(1)
    expect(mock.get).toHaveBeenCalledWith(key)
})