import * as currencyService from '../../../src/services/currencyService.js'
import * as currencyController from '../../../src/controllers/currencyController.js'
import mockConvesionSchema from '../../../src/validators/conversionSchema.js'
import mockCurrencySchema from '../../../src/validators/currencySchema.js'
import { RequestError } from '../../../src/errors/RequestError.js'

jest.mock('../../../src/validators/conversionSchema.js')
jest.mock('../../../src/validators/currencySchema.js')
jest.mock('../../../src/services/currencyService.js')

describe('Test Currency Controller', () => {
    const requestMock = (currencyObject = {}, code = '', query = {}) => {
        return {
            body: {
                ...currencyObject
            },
            params: {
                currencyCode: code
            },
            query
        }
    }

    const responseMock = () => {
        const res = {}
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        return res
    }

    test('Test get all currencies', async () => {
        const req = requestMock()
        const res = responseMock()

        currencyService.getAllCurrency.mockResolvedValue([{}])

        await currencyController.getAllCurrency(req, res)

        expect(currencyService.getAllCurrency).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
    })

    test('Test error to getting all currencies', async () => {
        const req = requestMock()
        const res = responseMock()

        currencyService.getAllCurrency.mockRejectedValue(new RequestError())

        await currencyController.getAllCurrency(req, res)

        expect(currencyService.getAllCurrency).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalled()
    })

    test('Test create a currency', async () => {
        const mockBody = {}
        const req = requestMock(mockBody)
        const res = responseMock()

        mockCurrencySchema.validate.mockResolvedValue({})
        currencyService.createCurrency.mockResolvedValue({})

        await currencyController.createCurrency(req, res)

        expect(mockCurrencySchema.validate).toHaveBeenCalled()
        expect(currencyService.createCurrency).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
    })

    test('Test validation error to creating a currency', async () => {
        const mockBody = {}

        const req = requestMock(mockBody)
        const res = responseMock()

        mockCurrencySchema.validate.mockRejectedValue({})
        currencyService.createCurrency.mockResolvedValue({})

        await currencyController.createCurrency(req, res)

        expect(mockCurrencySchema.validate).toHaveBeenCalled()
        expect(currencyService.createCurrency).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalled()
    })

    test('Test delete a currency', async () => {
        const mockParams = 'TEST'

        const req = requestMock({}, mockParams)
        const res = responseMock()

        currencyService.deleteCurrency.mockResolvedValue([{}])

        await currencyController.deleteCurrency(req, res)

        expect(currencyService.deleteCurrency).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
    })

    test('Test error to deleting a currency', async () => {
        const mockParams = 'TEST'

        const req = requestMock({}, mockParams)
        const res = responseMock()

        currencyService.deleteCurrency.mockRejectedValue({})

        await currencyController.deleteCurrency(req, res)

        expect(currencyService.deleteCurrency).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalled()
    })

    test('Test convert currency', async () => {
        const mockQuery = {
            from: 'TEST',
            to: 'BRL',
            amount: 2
        }
        const req = requestMock({}, '', mockQuery)
        const res = responseMock()

        mockConvesionSchema.validate.mockResolvedValue({})

        currencyService.convertCurrency.mockResolvedValue({})

        await currencyController.convertCurrency(req, res)

        expect(currencyService.convertCurrency).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
    })

    test('Test error to getting currency', async () => {
        const mockQuery = {}
        const req = requestMock({}, '', mockQuery)
        const res = responseMock()

        mockConvesionSchema.validate.mockRejectedValue({})

        currencyService.convertCurrency.mockResolvedValue({})

        await currencyController.convertCurrency(req, res)

        expect(currencyService.convertCurrency).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalled()
    })
})
