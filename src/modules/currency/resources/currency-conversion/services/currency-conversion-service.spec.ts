import { beforeAll, describe, expect, it} from '@jest/globals';
import { AppDataSource } from '../../../../../configs/typeorm.config';
import { CurrencyConversionService } from './currency-conversion.service'

describe('Should test delete currency service', () => {

  let currencyConversionService: CurrencyConversionService

  beforeAll(async () => {
    await AppDataSource.initialize()
    currencyConversionService = new CurrencyConversionService()
  })

  it('Should convert 1 BRL to EUR', async ()=> {
    const result = await currencyConversionService.execute({
      from: 'BRL',
      to: 'EUR',
      amount:'1'
    })

    expect(result).toBeTruthy()
    expect(+result.value).toBeGreaterThan(0)
    expect(result.value).toEqual(expect.any(String));
  })

  it('Should throw error when use unrecognized currency code', async ()=> {
    const result = currencyConversionService.execute({
      from: 'CRAZY',
      to: 'EUR',
      amount:'1'
    })
    expect(result).rejects.toThrowError()
  })
})