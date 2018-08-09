const redis = require('redis')

redis.mockGetResult = (result) => this.mockedGetResult = result
redis.getMocketGetResult = (key) => this.mockedGetResult[key] || "nil"

const mockGet = jest.fn((key, callback) => callback(null, redis.getMocketGetResult(key)))
const mockSet = jest.fn((key, value) => {})
const mockPublish = jest.fn((channe, message) => {})

redis.createClient = jest.fn(() => {
  const client = {}
  client.on = jest.fn()
  client.set = mockSet
  client.get = mockGet
  client.publish = mockPublish
  return client
})

const cacheRedis = require('./redis')

test('Salva valor no redis se não existir ou se for novo', () => {

  var cachedValues = {
    "symbol:BTC": "8000.10",
    "symbol:ETH": "500.20",
    "symbol:BRL": "4.00"
  }

  var newValues = [
    {currency: "BTC", value: 8000.10},
    {currency: "ETH", value: 500.10},
    {currency: "BRL", value: 4.20},
    {currency: "EUR", value: 8},
  ]

  redis.mockGetResult(cachedValues)

  cacheRedis.updateAndNotify(newValues)

  expect(mockGet.mock.calls.length).toBe(4)
  expect(mockGet.mock.calls[0][0]).toBe("symbol:BTC")
  expect(mockGet.mock.calls[1][0]).toBe("symbol:ETH")
  expect(mockGet.mock.calls[2][0]).toBe("symbol:BRL")
  expect(mockGet.mock.calls[3][0]).toBe("symbol:EUR")

  expect(mockSet.mock.calls.length).toBe(3)
  expect(mockSet.mock.calls[0]).toEqual(["symbol:ETH", 500.10])
  expect(mockSet.mock.calls[1]).toEqual(["symbol:BRL", 4.20])
  expect(mockSet.mock.calls[2]).toEqual(["symbol:EUR", 8])

  expect(mockPublish.mock.calls.length).toBe(3)
  expect(mockPublish.mock.calls[0]).toEqual(
    ["notifyChange","{\"currency\":\"ETH\",\"value\":500.1}"])
  expect(mockPublish.mock.calls[1]).toEqual(
    ["notifyChange","{\"currency\":\"BRL\",\"value\":4.2}"])
  expect(mockPublish.mock.calls[2]).toEqual(
    ["notifyChange", "{\"currency\":\"EUR\",\"value\":8}"])
})
