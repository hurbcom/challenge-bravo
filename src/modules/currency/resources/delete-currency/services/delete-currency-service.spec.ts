import { beforeAll, beforeEach, describe, expect, it, jest, test} from '@jest/globals';
import { AppDataSource } from '../../../../../configs/typeorm.config';
import { DeleteCurrencyService } from './delete-currency.service'

describe('Should test delete currency service', () => {

  let deleteCurrencyService: DeleteCurrencyService

  beforeAll(async () => {
    await AppDataSource.initialize()
    deleteCurrencyService = new DeleteCurrencyService()
  })

  it('Should return true when delete HURB (seed) from database', async ()=> {
    const result = await deleteCurrencyService.execute('HURB')
    expect(result).toBe(true)
  })

  it('Should return false when delete HOLA (no exist) from database', async ()=> {
    expect(() => deleteCurrencyService.execute('HOLA')).rejects.toThrowError() 
  })
})