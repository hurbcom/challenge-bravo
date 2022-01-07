import axios from 'axios'
import * as currencyRepository from '../../../src/repositories/currencyRepository.js'
import { updateCurrancyValues } from '../../../src/utils/updateCurrencyValue.js'

jest.mock('axios')
jest.mock('../../../src/repositories/currencyRepository.js')

describe('Test Update Currancy Value Utils', () => {
    test('Test USD currency', async () => {
        const mockCurrencyFromDatas = {
            code: 'USD',
            inDollar: 1,
            isFiatOrFictitious: false
        }

        const mockCurrencyToDatas = {
            code: 'BRL',
            inDollar: 0.8,
            isFiatOrFictitious: false
        }

        const response = await updateCurrancyValues(mockCurrencyFromDatas, mockCurrencyToDatas)

        expect(response).toHaveProperty('currencyFromInDollar')
        expect(response).toHaveProperty('currencyToInDollar')
    })

    test('Test Updating currency', async () => {
        const mockCurrencyFromDatas = {
            code: 'USD',
            inDollar: 1,
            isFiatOrFictitious: false,
            updatedAt: '2022-01-01T00:00:00.000Z'
        }

        const mockCurrencyToDatas = {
            code: 'BRL',
            inDollar: 0.8,
            isFiatOrFictitious: false,
            updatedAt: '2022-01-01T00:00:00.000Z'
        }

        const mockResponseEconomyApi = {
            BRLUSD: {
                ask: 2
            }
        }

        axios.get.mockResolvedValue({ data: mockResponseEconomyApi })
        currencyRepository.update.mockResolvedValue({})

        const response = await updateCurrancyValues(mockCurrencyFromDatas, mockCurrencyToDatas)

        expect(response).toHaveProperty('currencyFromInDollar')
        expect(response).toHaveProperty('currencyToInDollar')
        expect(axios.get).toHaveBeenCalled()
    })

    test('Test Any Error from Economy api', async () => {
        const mockCurrencyFromDatas = {
            code: 'USD',
            inDollar: 1,
            isFiatOrFictitious: false,
            updatedAt: '2022-01-01T00:00:00.000Z'
        }

        const mockCurrencyToDatas = {
            code: 'BRL',
            inDollar: 0.8,
            isFiatOrFictitious: false,
            updatedAt: '2022-01-01T00:00:00.000Z'
        }

        axios.get.mockRejectedValue({
            statusCode: 409
        })

        expect(updateCurrancyValues(mockCurrencyFromDatas, mockCurrencyToDatas)).rejects.toThrow()
    })

    test('Test Error 404 from Economy api', async () => {
        const mockCurrencyFromDatas = {
            code: 'USD',
            inDollar: 1,
            isFiatOrFictitious: false,
            updatedAt: '2022-01-01T00:00:00.000Z'
        }

        const mockCurrencyToDatas = {
            code: 'BRL',
            inDollar: 0.8,
            isFiatOrFictitious: false,
            updatedAt: '2022-01-01T00:00:00.000Z'
        }

        axios.get.mockRejectedValue({
            statusCode: 404
        })

        expect(updateCurrancyValues(mockCurrencyFromDatas, mockCurrencyToDatas)).rejects.toThrowError('Currency inserted is not real')
    })
})
