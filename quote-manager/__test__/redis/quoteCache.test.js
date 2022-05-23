jest.mock('redis')
const CONST = require('../../src/properties')
const quoteCache = require('../../src/redis/quoteCache')
const redis = require('redis')

const mock = {
    set: jest.fn().mockResolvedValue('OK')
}

beforeAll(()=>{
    redis.createClient.mockImplementation(()=>{
        return mock
    })
    global.client = redis.createClient()
})

beforeEach(()=>{
    mock.set.mockClear()
})


test('It should register quotations in redis with success.', ()=>{
    const key = 'BTC'
    const value = { "ask": "29.242", "bid": "29.241" }

    const expected = JSON.stringify(value)

    const result = quoteCache.register(key, value)
    
    expect(result).resolves.toEqual('OK')
    expect(mock.set).toHaveBeenCalledTimes(1)
    expect(mock.set).toHaveBeenCalledWith(key,expected)
})

test('It should register string in redis with success.', ()=>{
    const key = 'BTC'
    const value = "Teste valor alguma coisa"

    const result = quoteCache.register(key, value)
    
    expect(result).resolves.toEqual('OK')
    expect(mock.set).toHaveBeenCalledTimes(1)
    expect(mock.set).toHaveBeenCalledWith(key,value)
})