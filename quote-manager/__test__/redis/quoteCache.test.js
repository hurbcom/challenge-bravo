jest.mock('redis')
const CONST = require('../../src/properties')
const quoteCache = require('../../src/redis/quoteCache')
const redis = require('redis')

const mock = {
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue('OK')
}

beforeAll(()=>{
    redis.createClient.mockImplementation(()=>{
        return mock
    })
    global.client = redis.createClient()
})

beforeEach(()=>{
    global.HandleError.mockClear()
    mock.set.mockClear()
    mock.del.mockClear()
})


test('It should register quotations in redis with success.', ()=>{
    const key = 'BTC'
    const value = { "ask": "29.242", "bid": "29.241" }

    const expected = JSON.stringify(value)

    const result = quoteCache.register(key, value)
    
    expect(result).resolves.toEqual('OK')
    expect(mock.set).toHaveBeenCalledTimes(1)
    expect(mock.set).toHaveBeenCalledWith(key,expected, {"EX": 0})
})

test('It should register string in redis with success.', ()=>{
    const key = 'BTC'
    const value = "Teste valor alguma coisa"
    const valueStringfy = "\"Teste valor alguma coisa\""

    const result = quoteCache.register(key, value)
    
    expect(result).resolves.toEqual('OK')
    expect(mock.set).toHaveBeenCalledTimes(1)
    expect(mock.set).toHaveBeenCalledWith(key,valueStringfy, {"EX": 0})
})


test('It should remove quotations in redis with success.', ()=>{
    const key = 'BTC'
    const value = { "ask": "29.242", "bid": "29.241" }

    const expected = JSON.stringify(value)

    const result = quoteCache.remove(key)
    
    expect(result).resolves.toEqual('OK')
    expect(mock.del).toHaveBeenCalledTimes(1)
    expect(mock.del).toHaveBeenCalledWith(key)
})

test('It should remove string in redis with success.', ()=>{
    const key = 'BTC'
    const value = "Teste valor alguma coisa"
    const valueStringfy = "\"Teste valor alguma coisa\""

    const result = quoteCache.remove(key)
    
    expect(result).resolves.toEqual('OK')
    expect(mock.del).toHaveBeenCalledTimes(1)
    expect(mock.del).toHaveBeenCalledWith(key)
})