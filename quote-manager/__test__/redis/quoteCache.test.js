jest.mock('redis')
const CONST = require('../../src/properties')
const quoteCache = require('../../src/redis/quoteCache')
const redis = require('redis')


test('It should register quotations in redis with success.', ()=>{

    quoteCache.registerQuotation(coinName, quotations)
    
})