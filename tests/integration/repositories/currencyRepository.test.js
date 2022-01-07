import * as currencyRepository from '../../../src/repositories/currencyRepository.js'
import Currency from '../../../src/models/currency.js'
import mongoose from 'mongoose'

describe('Test Integration with mongoDB', () => {
    beforeEach(async () => await Currency.deleteMany())
    afterEach(async () => await Currency.deleteMany())
    afterAll(async () => await mongoose.connection.close())

    test('Getting all currencies', async () => {
        const response = await currencyRepository.getAll()

        expect(response).toEqual([])
    })

    test('Getting a currency by code', async () => {
        const mockCurrency = {
            code: 'TEST',
            name: 'TEST',
            inDollar: 2,
            isFiatOrFictitious: true
        }

        await currencyRepository.create(mockCurrency)

        const response = await currencyRepository.getByCode(mockCurrency.code)

        expect(response).toHaveProperty('code', 'TEST')
        expect(response).toHaveProperty('name', 'TEST')
        expect(response).toHaveProperty('inDollar', 2)
    })

    test('Creating a currency', async () => {
        const mockCurrency = {
            code: 'TEST',
            name: 'TEST',
            inDollar: 2,
            isFiatOrFictitious: true
        }

        const response = await currencyRepository.create(mockCurrency)

        expect(response).toHaveProperty('code')
        expect(response).toHaveProperty('name')
        expect(response).toHaveProperty('inDollar')
        expect(response).toHaveProperty('_id')
        expect(response).toHaveProperty('createdAt')
        expect(response).toHaveProperty('updatedAt')
    })

    test('Updating a currency', async () => {
        const mockCurrency = {
            code: 'TEST',
            name: 'TEST',
            inDollar: 2,
            isFiatOrFictitious: true
        }

        await currencyRepository.create(mockCurrency)

        const response = await currencyRepository.update(mockCurrency.code, 3)

        expect(response).toHaveProperty('code')
        expect(response).toHaveProperty('name')
        expect(response).toHaveProperty('inDollar', 3)
    })

    test('Deleting a currency', async () => {
        const mockCurrency = {
            code: 'TEST',
            name: 'TEST',
            inDollar: 2,
            isFiatOrFictitious: true
        }

        await currencyRepository.create(mockCurrency)

        const response = await currencyRepository.deleteByCode(mockCurrency.code)

        expect(response).toHaveProperty('deletedCount', 1)
    })
})
