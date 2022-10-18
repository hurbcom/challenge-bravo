import { beforeAll, describe, expect, it} from '@jest/globals';
import { AppDataSource } from '../../../../../configs/typeorm.config';
import { CreateCurrencyService } from './create-currency.service';

describe('Should test delete currency service', () => {

  let createCurrencyService: CreateCurrencyService

  beforeAll(async () => {
    await AppDataSource.initialize()
    createCurrencyService = new CreateCurrencyService()
  })

  it('Should create "CHALLENGE" coin ', async ()=> {
    const result = await createCurrencyService.execute({
      code: 'CHALLENGE',
      backedCurrencyCode: 'USD',
      unitCost: '100'
    })

    expect(result).toBeTruthy()
    expect(result.backedCurrencyCode).toEqual('USD')
    expect(result.code).toEqual('CHALLENGE')
    expect(result.unitCost).toEqual('100')
  })

  it('Should throw error try to insert and CODE that already has been registred', async ()=> {
    const result = createCurrencyService.execute({
      code: 'CHALLENGE',
      backedCurrencyCode: 'USD',
      unitCost: '100'
    })

    expect(result).rejects.toThrowError()
  })
})