require('../../src/model/coin')
const repositoryCoin = require('../../src/repository/coin')
const { models } = require('mongoose')
const mock = require('../mock/repository/coin.mock')

beforeEach(() => {
    global.HandleError.mockClear()
})

describe('It should tests function add', () => {

    beforeAll(() => {
        models.CoinModel.prototype.save = jest.fn()
    })

    beforeEach(() => {
        jest.clearAllMocks();
        models.CoinModel.prototype.save.mockReset()
    })

    test('It should save coin with success.', async () => {

        const mock_doc = () => {
            return Promise.resolve(
                new models.CoinModel(mock.MOCK_COIN_MODEL())
            )
        }

        const spy = jest.spyOn(models.CoinModel.prototype, 'save').mockImplementationOnce(mock_doc)

        const received = await repositoryCoin.add(mock.MOCK_COIN())

        expect(received.toObject()).toEqual(mock.MOCK_COIN_MODEL())
        expect(spy).toHaveBeenCalledTimes(1)
    })

    test('It should save coin but return Error', async () => {
        const mock_doc = () => {
            return Promise.reject(mock.MOCK_ERROR_MONGO())
        }

        const mockError = mock.MOCK_ERROR_MONGO({ message: 'Erro ao tentar salvar a moeda: Algum error quando foi salvar' })

        const spy = jest.spyOn(models.CoinModel.prototype, 'save').mockImplementationOnce(mock_doc)

        const received = repositoryCoin.add(mock.MOCK_COIN())

        await expect(received).rejects.toEqual(new Error(mockError))
        expect(spy).toHaveBeenCalledTimes(1)
        expect(HandleError).toHaveBeenCalledWith(mockError)
    })
})

describe('It should tests function findOneCoin', () => {

    beforeAll(() => {
        models.CoinModel.findOne = jest.fn()
    })

    beforeEach(() => {
        jest.clearAllMocks();
        models.CoinModel.findOne.mockReset()
    })

    test('It should find coin with success.', async () => {

        const coinCode = mock.MOCK_COIN().coinCode
        const query = { coinCode: coinCode }
        const project = { _id: 0, __v: 0 }

        const spy = jest.spyOn(models.CoinModel, 'findOne').mockResolvedValueOnce(mock.MOCK_COIN())

        const received = await repositoryCoin.findOneCoin(coinCode)

        expect(received).toEqual(mock.MOCK_COIN())
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, project)
    })

    test('It should find coin but return Error.', async () => {
        const mock_result = () => {
            return Promise.reject(mock.MOCK_ERROR_MONGO())
        }

        const coinCode = mock.MOCK_COIN().coinCode
        const query = { coinCode: coinCode }
        const project = { _id: 0, __v: 0 }

        const mockError = mock.MOCK_ERROR_MONGO()

        const spy = jest.spyOn(models.CoinModel, 'findOne').mockImplementationOnce(mock_result)

        const received = repositoryCoin.findOneCoin(coinCode)

        await expect(received).rejects.toEqual(mockError)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, project)
    })


    test('It should find coin but return Error because not find coin.', async () => {

        const coinCode = mock.MOCK_COIN().coinCode
        const query = { coinCode: coinCode }
        const project = { _id: 0, __v: 0 }

        const mockError = mock.MOCK_ERROR_MONGO({ message: 'Moeda não encontrada', name: 'Error' })

        const spy = jest.spyOn(models.CoinModel, 'findOne').mockResolvedValueOnce(null)

        const received = repositoryCoin.findOneCoin(coinCode)

        await expect(received).rejects.toEqual(mockError)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, project)
        expect(HandleError).toHaveBeenCalledWith("Moeda não encontrada", 404, { "coinCode": "HURB" })
    })
})

describe('It should tests function getAllCoin', () => {

    beforeAll(() => {
        models.CoinModel.find = jest.fn()
    })

    beforeEach(() => {
        jest.clearAllMocks();
        models.CoinModel.find.mockReset()
    })

    test('It should find coins with success but without filter type.', async () => {

        const spy = jest.spyOn(models.CoinModel, 'find').mockResolvedValueOnce([mock.MOCK_COIN()])

        const query = {}
        const project = { _id: 0, __v: 0 }

        const received = await repositoryCoin.getAllCoin()

        expect(received).toEqual([mock.MOCK_COIN()])
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, project)
    })

    test('It should find coins with success but with filter type.', async () => {

        const spy = jest.spyOn(models.CoinModel, 'find').mockResolvedValueOnce([mock.MOCK_COIN()])

        const query = { type: 'FIXE' }
        const project = { _id: 0, __v: 0 }

        const received = await repositoryCoin.getAllCoin('FIXE')

        expect(received).toEqual([mock.MOCK_COIN()])
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, project)
    })

    test('It should find coins but return empty.', async () => {

        const spy = jest.spyOn(models.CoinModel, 'find').mockResolvedValueOnce([])

        const query = { type: 'FIXE' }
        const project = { _id: 0, __v: 0 }

        const received = repositoryCoin.getAllCoin('FIXE')

        await expect(received).resolves.toEqual([])
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, project)
    })


    test('It should find coins but return Error', async () => {
        const mock_result = () => {
            return Promise.reject(mock.MOCK_ERROR_MONGO())
        }

        const coinCode = mock.MOCK_COIN().coinCode
        const query = {}
        const project = { _id: 0, __v: 0 }

        const mockError = mock.MOCK_ERROR_MONGO()

        const spy = jest.spyOn(models.CoinModel, 'find').mockImplementationOnce(mock_result)

        const received = repositoryCoin.getAllCoin()

        await expect(received).rejects.toEqual(mockError)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, project)
    })
})

describe('It should tests function update', () => {

    beforeAll(() => {
        repositoryCoin.findOneCoin = jest.fn()
        models.CoinModel.updateOne = jest.fn()
    })

    beforeEach(() => {
        jest.clearAllMocks();
        repositoryCoin.findOneCoin.mockReset()
        models.CoinModel.updateOne.mockReset()
    })

    test('It should update coin with success.', async () => {

        const spyFind = jest.spyOn(repositoryCoin, 'findOneCoin').mockResolvedValueOnce('ok')
        const spy = jest.spyOn(models.CoinModel, 'updateOne').mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())

        const coinCode = mock.MOCK_COIN().coinCode
        const query = { coinCode: coinCode }

        const received = await repositoryCoin.update(coinCode, mock.MOCK_COIN())

        expect(received).toEqual(mock.MOCK_RETURN_UPDATE())
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, mock.MOCK_COIN())

    })

    test('It should update coin with success but not have change.', async () => {

        const spyFind = jest.spyOn(repositoryCoin, 'findOneCoin').mockResolvedValueOnce('ok')
        const spy = jest.spyOn(models.CoinModel, 'updateOne').mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE({ mfCount: 0 }))

        const coinCode = mock.MOCK_COIN().coinCode
        const query = { coinCode: coinCode }

        const received = await repositoryCoin.update(coinCode, mock.MOCK_COIN())

        expect(received).toEqual(mock.MOCK_RETURN_UPDATE({ mfCount: 0 }))
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, mock.MOCK_COIN())
    })

    test('It should find coin but return empty.', async () => {
        const spyFind = jest.spyOn(repositoryCoin, 'findOneCoin')
            .mockRejectedValueOnce(mock.MOCK_HANDLE_ERROR())
        const spy = jest.spyOn(models.CoinModel, 'updateOne').mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE({ mfCount: 0 }))

        const coinCode = mock.MOCK_COIN().coinCode

        const received = repositoryCoin.update(coinCode, mock.MOCK_COIN())

        await expect(received).rejects.toEqual(mock.MOCK_HANDLE_ERROR())
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode)
        expect(spy).toHaveBeenCalledTimes(0)
    })


    test('It should update coin but return Error.', async () => {
        const spyFind = jest.spyOn(repositoryCoin, 'findOneCoin').mockResolvedValueOnce('ok')
        const spy = jest.spyOn(models.CoinModel, 'updateOne').mockRejectedValueOnce(mock.MOCK_ERROR_MONGO())

        const coinCode = mock.MOCK_COIN().coinCode
        const query = { coinCode: coinCode }

        const received = repositoryCoin.update(coinCode, mock.MOCK_COIN())

        await expect(received).rejects.toEqual(mock.MOCK_ERROR_MONGO())
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query, mock.MOCK_COIN())
    })

})

describe('It should tests function updateQuoteValue', () => {

    beforeAll(() => {
        repositoryCoin.update = jest.fn()
    })

    beforeEach(() => {
        jest.clearAllMocks();
        repositoryCoin.update.mockReset()
    })

    test('It should update quote with success.', async () => {

        const spyFind = jest.spyOn(repositoryCoin, 'update').mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE())

        const coinCode = mock.MOCK_COIN().coinCode
        const quote = {
            coinCode: coinCode,
            buy: "30.10",
            sale: "30"
        }

        const coin = { quote: { 'sale': quote.sale, 'buy': quote.buy } }


        const received = await repositoryCoin.updateQuoteValue(quote)

        expect(received).toEqual(mock.MOCK_RETURN_UPDATE())
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode, coin)

    })

    test('It should update quote with success but not have change.', async () => {

        const spyFind = jest.spyOn(repositoryCoin, 'update').mockResolvedValueOnce(mock.MOCK_RETURN_UPDATE({ mfCount: 0 }))

        const coinCode = mock.MOCK_COIN().coinCode
        const quote = {
            coinCode: coinCode,
            buy: "30.10",
            sale: "30"
        }

        const coin = { quote: { 'sale': quote.sale, 'buy': quote.buy } }

        const received = await repositoryCoin.updateQuoteValue(quote)

        expect(received).toEqual(mock.MOCK_RETURN_UPDATE({ mfCount: 0 }))
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode, coin)
    })

    test('It should find coin but return empty.', async () => {
        const spyFind = jest.spyOn(repositoryCoin, 'update')
            .mockRejectedValueOnce(mock.MOCK_HANDLE_ERROR())

        const coinCode = mock.MOCK_COIN().coinCode
        const quote = {
            coinCode: coinCode,
            buy: "30.10",
            sale: "30"
        }

        const coin = { quote: { 'sale': quote.sale, 'buy': quote.buy } }

        const received = repositoryCoin.updateQuoteValue(quote)

        await expect(received).rejects.toEqual(mock.MOCK_HANDLE_ERROR())
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode, coin)
    })


})

describe('It should tests function delete', () => {

    beforeAll(() => {
        repositoryCoin.findOneCoin = jest.fn()
        models.CoinModel.deleteOne = jest.fn()
    })

    beforeEach(() => {
        jest.clearAllMocks();
        repositoryCoin.findOneCoin.mockReset()
        models.CoinModel.deleteOne.mockReset()
    })

    test('It should delete coin with success.', async () => {

        const spyFind = jest.spyOn(repositoryCoin, 'findOneCoin').mockResolvedValueOnce('ok')
        const spy = jest.spyOn(models.CoinModel, 'deleteOne').mockResolvedValueOnce(mock.MOCK_RETURN_DELETE())

        const coinCode = mock.MOCK_COIN().coinCode
        const query = { coinCode: coinCode }

        const received = await repositoryCoin.delete(coinCode, mock.MOCK_COIN())

        expect(received).toEqual(mock.MOCK_RETURN_DELETE())
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query)

    })

    test('It should delete coin but return empty.', async () => {
        const spyFind = jest.spyOn(repositoryCoin, 'findOneCoin')
            .mockRejectedValueOnce(mock.MOCK_HANDLE_ERROR())
        const spy = jest.spyOn(models.CoinModel, 'deleteOne').mockResolvedValueOnce()

        const coinCode = mock.MOCK_COIN().coinCode

        const received = repositoryCoin.delete(coinCode, mock.MOCK_COIN())

        await expect(received).rejects.toEqual(mock.MOCK_HANDLE_ERROR())
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode)
        expect(spy).toHaveBeenCalledTimes(0)
    })


    test('It should delete coin but return Error.', async () => {
        const spyFind = jest.spyOn(repositoryCoin, 'findOneCoin').mockResolvedValueOnce('ok')
        const spy = jest.spyOn(models.CoinModel, 'deleteOne').mockRejectedValueOnce(mock.MOCK_ERROR_MONGO())

        const coinCode = mock.MOCK_COIN().coinCode
        const query = { coinCode: coinCode }

        const received = repositoryCoin.delete(coinCode, mock.MOCK_COIN())

        await expect(received).rejects.toEqual(mock.MOCK_ERROR_MONGO())
        expect(spyFind).toHaveBeenCalledTimes(1)
        expect(spyFind).toHaveBeenCalledWith(coinCode)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(query)
    })

})