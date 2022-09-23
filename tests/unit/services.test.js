import { jest } from '@jest/globals'
import { currenciesService } from '../../src/services/currenciesService.js'
import { currenciesRepository } from '../../src/repositories/currenciesRepository.js'
import { exchangeService } from '../../src/services/exchangesService.js'

beforeEach(() => {
	jest.clearAllMocks()
	jest.resetAllMocks()
})

describe('Services unit tests', () => {
	describe('Currencies service', () => {
		it('should throw an error if database is empty', async () => {
			jest
				.spyOn(currenciesRepository, 'getAllCurrencies')
				.mockResolvedValue(null)

			const getCurrencies = async () =>
				await currenciesService.getCurrencies()

			expect(getCurrencies()).rejects.toEqual({
				type: 'not_found',
				message: 'No currencies found'
			})
		})

		it('should throw an error if currency does not exist', async () => {
			jest
				.spyOn(currenciesRepository, 'getOneCurrency')
				.mockResolvedValue(null)

			const getCurrency = async () =>
				await currenciesService.getCurrency('MTS')

			expect(getCurrency()).rejects.toEqual({
				type: 'not_found',
				message: 'Currency not found'
			})
		})

		it("should throw an error if currency already exists and don't create a new currency", async () => {
			jest.spyOn(currenciesRepository, 'getOneCurrency').mockResolvedValue({
				name: 'Moeda Teste',
				code: 'MTS',
				rate: 1,
				type: 'crypto'
			})

			const createCurrency = async () =>
				await currenciesService.create('Moeda Teste', 'MTS', 1, 'crypto')

			const create = jest.spyOn(currenciesRepository, 'createCurrency')

			expect(createCurrency()).rejects.toEqual({
				type: 'conflict',
				message: 'This code already exists'
			})

			expect(create).not.toBeCalled()
		})

		it('should throw an error when trying delete a base currency', async () => {
			jest.spyOn(currenciesRepository, 'getOneCurrency').mockResolvedValue({
				name: 'American Dollar',
				code: 'USD',
				rate: 1,
				type: 'base'
			})

			const deleteCurrency = async () =>
				await currenciesService.deleteCurrency('USD')

			const deletion = jest.spyOn(currenciesRepository, 'deleteCurrency')

			expect(deleteCurrency()).rejects.toEqual({
				type: 'conflict',
				message: `This is a base currency, can't delete it!`
			})

			expect(deletion).not.toBeCalled()
		})

		it('should throw an error trying delete a currency that does not exist', async () => {
			jest
				.spyOn(currenciesRepository, 'getOneCurrency')
				.mockResolvedValue(null)

			const deleteCurrency = async () =>
				await currenciesService.deleteCurrency('MTS')

			const deletion = jest.spyOn(currenciesRepository, 'deleteCurrency')

			expect(deleteCurrency()).rejects.toEqual({
				type: 'not_found',
				message: 'Currency not found'
			})

			expect(deletion).not.toBeCalled()
		})
	})

	describe('Exchanges service', () => {
		it('should throw an error if one or more parameters is missing', async () => {
            const exchange = jest.spyOn(currenciesRepository, 'getRatesPair')
			const convert = async () => await exchangeService.convert('USD', 'BRL', null)

			expect(convert()).rejects.toEqual({
				type: 'bad_request',
				message: 'Missing info to convert, check your parameters'
			})

            expect(exchange).not.toBeCalled()
		})

        it('should not convert if one or both currencies are not included in database', async () => {
            jest.spyOn(currenciesRepository, 'getRatesPair').mockResolvedValue({
                from: {
                    name: 'American Dollar',
                    code: 'USD',
                    rate: 1,
                    type: 'base'
                },
                to: undefined
            })

            const convert = async () => await exchangeService.convert('USD', 'BRL', 1)

            expect(convert()).rejects.toEqual({
                type: 'unprocessable_entity',
                message: 'One or both currencies are not included in database'
            })
        })
	})
})
