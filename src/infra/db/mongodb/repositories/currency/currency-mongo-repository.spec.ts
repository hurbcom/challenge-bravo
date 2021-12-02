import { Collection } from 'mongodb'
import { CurrencyModel } from '../../../../../domain/models/currency'
import { MongoHelper } from '../../helpers/mongo-helper'
import { CurrencyMongoRepository } from './currency-mongo-repository'

let currencyCollection: Collection

describe('account mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    currencyCollection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
    await currencyCollection.deleteMany({})
  })

  const makeSut = () => {
    return new CurrencyMongoRepository()
  }
  const makeFakeCurrency = ():CurrencyModel => ({
    name: 'any currency',
    shortName: 'ANY',
    USDvalue: 1
  })
  describe('add', () => {
    test('should return true on add account', async () => {
      const sut = makeSut()
      const result = await sut.add(makeFakeCurrency())
      expect(result).toBe(true)

      const dbCurrency = await currencyCollection.findOne({ shortName: makeFakeCurrency().shortName })
      expect(dbCurrency._id).toBeTruthy()
      expect(dbCurrency.name).toEqual('any currency')
      expect(dbCurrency.shortName).toEqual('ANY')
    })
  })
})
