import { beforeAll, beforeEach, describe, expect, it, jest, test} from '@jest/globals';
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
    expect(result.value).toBeGreaterThanOrEqual
  })

  it('Should return false when delete HOLA (no exist) from database', async ()=> {
    //expect(() => deleteCurrencyService.execute('HOLA')).rejects.toThrowError() 
  })
})