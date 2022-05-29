jest.mock('../../src/repository/coin.js')
jest.mock('../../src/redis/quoteCache.js')
const mock = require('../mock/repository/coin.mock')
const repositoryCoin = require('../../src/repository/coin')
const redis = require('../../src/redis/quoteCache.js')
const controllerCoin = require('../../src/controller/coin')

beforeAll(() => {
    console.error = jest.fn()
    console.error.mockImplementation((...args) => {
        consoleError(...args)
    })
})

beforeEach(() => {
    redis.register.mockReset()
    repositoryCoin.add.mockReset()
    repositoryCoin.update.mockReset()
    repositoryCoin.delete.mockReset()
    repositoryCoin.findOneCoin.mockReset()
    repositoryCoin.getAllCoin.mockReset()
})

test('It should get coin with success', async () => {

    const mockResponse = {
        "error": false,
        "status": 200,
        "date": new Date().toISOString(),
        "message": "Lista de moedas",
        "data": ["HURB"]
    }

    const type = 'FIXE'

    repositoryCoin.getAllCoin.mockResolvedValueOnce([mock.MOCK_COIN()])

    const spy = jest.spyOn(repositoryCoin, 'getAllCoin')

    const received = controllerCoin.getAll(type)

    await expect(received).resolves.toEqual(mockResponse)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(type)
})

test('It should get coin with success', async () => {

    const mockResponse = {
        "error": false,
        "status": 200,
        "date": new Date().toISOString(),
        "message": "Moeda encontrada",
        "data": mock.MOCK_COIN()
    }

    const coinCode = mock.MOCK_COIN().coinCode

    repositoryCoin.findOneCoin.mockResolvedValueOnce(mock.MOCK_COIN())

    const spy = jest.spyOn(repositoryCoin, 'findOneCoin')

    const received = controllerCoin.getCoin(coinCode)

    await expect(received).resolves.toEqual(mockResponse)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(coinCode)
})

test('It should create coin with success', async () => {

    const mockResponse = {
        "error": false,
        "status": 201,
        "date": new Date().toISOString(),
        "message": "Moeda Salvo com sucesso",
        "data": undefined
    }

    repositoryCoin.add.mockResolvedValueOnce(mock.MOCK_COIN_MODEL())

    const spy = jest.spyOn(repositoryCoin, 'add')

    const received = controllerCoin.add(mock.MOCK_COIN())

    await expect(received).resolves.toEqual(mockResponse)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(mock.MOCK_COIN())
})

test('It should update coin with success', async () => {

    const mockResponse = {
        "error": false,
        "status": 200,
        "date": new Date().toISOString(),
        "message": "Moeda Atualizada com sucesso",
        "data": undefined
    }

    const coin = mock.MOCK_COIN()
    const coinCode = coin.coinCode
    delete coin.coinCode

    repositoryCoin.update.mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())

    const spy = jest.spyOn(repositoryCoin, 'update')

    const received = controllerCoin.update(coinCode, coin)

    await expect(received).resolves.toEqual(mockResponse)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(coinCode, coin)
})

test('It should delete coin with success', async () => {

    const mockResponse = {
        "error": false,
        "status": 200,
        "date": new Date().toISOString(),
        "message": "Moeda Removida com sucesso",
        "data": undefined
    }

    const coinCode = mock.MOCK_COIN().coinCode

    redis.register.mockResolvedValueOnce('OK')
    repositoryCoin.delete.mockResolvedValueOnce(mock.MOCK_RETURN_DELETE())

    const spyRedis = jest.spyOn(redis, 'register')
    const spy = jest.spyOn(repositoryCoin, 'delete')

    const received = controllerCoin.delete(coinCode)

    await expect(received).resolves.toEqual(mockResponse)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(coinCode)
    expect(spyRedis).toHaveBeenCalledTimes(1)
    expect(spyRedis).toHaveBeenCalledWith('HURB',undefined)
})