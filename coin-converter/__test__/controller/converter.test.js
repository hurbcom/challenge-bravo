jest.mock('../../src/factory/calculate.js')
jest.mock('../../src/redis/quoteCache.js')

const factoryCalculate = require('../../src/factory/calculate')
const quoteCache = require('../../src/redis/quoteCache')

const controllerConverter = require('../../src/controller/converter')

beforeEach(() => {
    jest.clearAllMocks()
    global.HandleError.mockClear()
    factoryCalculate.conversion.mockReset()
    quoteCache.read.mockReset()
})

test('It should calculate conversion into EUR end BRL.', async () => {

    const expected = {
        "error": false,
        "status": 200,
        "date": new Date().toISOString(),
        "message": "Calculado com sucesso",
        "data": {
            "quoteFrom": 1.0697,
            "quoteTo": 0.2073,
            "valueCalculate": 516.015436565,
            "type": "buy"
        }
    }

    const requestValue = { from: "EUR", to: "BRL", value: "100.00", type: "buy" }

    const mock_from = { buy: 1.0697, sale: 1.0701 }
    const mock_to = { buy: 0.2073, sale: 0.2073 }

    quoteCache.read.mockResolvedValueOnce(mock_from)
    quoteCache.read.mockResolvedValueOnce(mock_to)

    factoryCalculate.conversion.mockReturnValueOnce(516.015436565)

    const spayRedis = jest.spyOn(quoteCache, 'read')
    const spayCalc = jest.spyOn(factoryCalculate, 'conversion')

    const received = controllerConverter.calculate(requestValue)

    await expect(received).resolves.toEqual(expected)
    expect(spayRedis).toHaveBeenCalledTimes(2)
    expect(spayRedis).toHaveBeenNthCalledWith(1, requestValue.from)
    expect(spayRedis).toHaveBeenNthCalledWith(2, requestValue.to)
    expect(spayCalc).toHaveBeenCalledTimes(1)
    expect(spayCalc).toHaveBeenCalledWith(mock_from.buy, requestValue.value, mock_to.buy)
})


test('It should calculate conversion into EUR end BRL but not find coin in redis', async () => {

    const expected = {
        "error": true,
        "status": 404,
        "date": new Date().toISOString(),
        "message": "Moeda não disponivel para conversão",
        "data": { "coinCode": "EUR" }
    }

    const requestValue = { from: "EUR", to: "BRL", value: "100.00", type: "buy" }

    const mock_from = { buy: 1.0697, sale: 1.0701 }
    const mock_to = { buy: 0.2073, sale: 0.2073 }

    quoteCache.read.mockResolvedValueOnce(null)
    quoteCache.read.mockResolvedValueOnce(mock_to)

    factoryCalculate.conversion.mockReturnValueOnce("Não disponivel")

    const spayRedis = jest.spyOn(quoteCache, 'read')
    const spayCalc = jest.spyOn(factoryCalculate, 'conversion')

    const received = controllerConverter.calculate(requestValue)

    await expect(received).rejects.toEqual(new Error("Moeda não disponivel para conversão"))
    expect(spayRedis).toHaveBeenCalledTimes(2)
    expect(spayRedis).toHaveBeenNthCalledWith(1, requestValue.from)
    expect(spayRedis).toHaveBeenNthCalledWith(2, requestValue.to)
    expect(spayCalc).toHaveBeenCalledTimes(0)
    expect(HandleError).toHaveBeenCalledTimes(1)
    expect(HandleError).toHaveBeenNthCalledWith(1, "Moeda não disponivel para conversão", 404, { "coinCode": "EUR" })
})