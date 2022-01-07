import * as currencyRepository from '../../../src/repositories/currencyRepository.js'
import { updateCurrancyValues } from '../../../src/utils/updateCurrencyValue.js'
import * as currencyService from '../../../src/services/currencyService.js'

jest.mock('../../../src/repositories/currencyRepository.js')
jest.mock('../../../src/utils/updateCurrencyValue.js')

describe('Test Currency Service', () => {
    test('Test get all currencies', async () => {
        currencyRepository.getAll.mockResolvedValue([{}])

        await currencyService.getAllCurrency()

        expect(currencyRepository.getAll).toHaveBeenCalled()
    })

    test('Test error to getting all currencies', async () => {
        currencyRepository.getAll.mockRejectedValue(new Error())

        expect(currencyService.getAllCurrency()).rejects.toThrow()
        expect(currencyRepository.getAll).toHaveBeenCalled()
    })

    test('Test create a currency', async () => {
        const mockCurrencyDatas = {
            code: 'TEST',
            name: 'Teste',
            inDollar: 2,
            isFiatOrFictitious: true
        }

        currencyRepository.create.mockResolvedValue([{}])

        await currencyService.createCurrency(mockCurrencyDatas)

        expect(currencyRepository.create).toHaveBeenCalledWith(mockCurrencyDatas)
    })

    test('Test error to creating a currency', async () => {
        const mockCurrencyDatas = {
            code: 'TEST',
            name: 'Teste',
            inDollar: 2,
            isFiatOrFictitious: true
        }

        currencyRepository.create.mockRejectedValue(new Error())

        expect(currencyService.createCurrency(mockCurrencyDatas)).rejects.toThrow()
        expect(currencyRepository.create).toHaveBeenCalled()
    })

    test('Test convert currency', async () => {
        const mockConversionDatas = {
            currencyFrom: 'USD',
            currencyTo: 'BRL',
            amount: 2
        }

        const currencyFromInDollar = 2
        const currencyToInDollar = 1

        currencyRepository.getByCode.mockResolvedValue([{}])
        updateCurrancyValues.mockResolvedValue({ currencyFromInDollar, currencyToInDollar })

        const response = await currencyService.convertCurrency(mockConversionDatas)

        expect(currencyRepository.getByCode).toHaveBeenCalledTimes(2)
        expect(response).toHaveProperty('from', 'USD')
        expect(response).toHaveProperty('to', 'BRL')
        expect(response).toHaveProperty('convertedAmount', '$ 4.00 BRL')
    })

    test('Test error to converting currency', async () => {
        const mockConversionDatas = {
            currencyFrom: 'USD',
            currencyTo: 'BRL',
            amount: 2
        }

        currencyRepository.getByCode.mockResolvedValue([{}])

        updateCurrancyValues.mockRejectedValue(new Error())

        expect(currencyService.convertCurrency(mockConversionDatas)).rejects.toThrow()
        expect(currencyRepository.getByCode).toHaveBeenCalled()
    })

    test('Test delete a currency', async () => {
        const mockCurrencyCode = 'TEST'

        currencyRepository.deleteByCode.mockResolvedValue({})

        await currencyService.deleteCurrency(mockCurrencyCode)

        expect(currencyRepository.deleteByCode).toHaveBeenCalledWith(mockCurrencyCode)
    })

    test('Test error to deleting a currency', async () => {
        const mockCurrencyCode = 'TEST'

        currencyRepository.deleteByCode.mockRejectedValue(new Error())

        expect(currencyService.deleteCurrency(mockCurrencyCode)).rejects.toThrow()
        expect(currencyRepository.deleteByCode).toHaveBeenCalled()
    })
})
