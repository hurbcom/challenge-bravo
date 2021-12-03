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

  describe('upsert', () => {
    test('should return true on update account', async () => {
      const sut = makeSut()
      await sut.add(makeFakeCurrency())
      const newValue = { ...makeFakeCurrency(), USDvalue: 100 }
      const updated = await sut.upsert(newValue)
      expect(updated).toBe(true)

      const dbCurrency = await currencyCollection.findOne({ shortName: makeFakeCurrency().shortName })
      expect(dbCurrency._id).toBeTruthy()
      expect(dbCurrency.name).toEqual('any currency')
      expect(dbCurrency.shortName).toEqual('ANY')
      expect(dbCurrency.USDvalue).toEqual(100)
    })
    test('should return true on upsert account that doesnt exists', async () => {
      const sut = makeSut()
      const updated = await sut.upsert(makeFakeCurrency())
      expect(updated).toBe(true)

      const dbCurrency = await currencyCollection.findOne({ shortName: makeFakeCurrency().shortName })
      expect(dbCurrency._id).toBeTruthy()
      expect(dbCurrency.name).toEqual('any currency')
      expect(dbCurrency.shortName).toEqual('ANY')
      expect(dbCurrency.USDvalue).toEqual(1)
    })
  })

  describe('updateByShortName', () => {
    test('should return true on update account by shortName', async () => {
      const sut = makeSut()
      await sut.add(makeFakeCurrency())
      const newValue = { ...makeFakeCurrency(), USDvalue: 100 }
      const updated = await sut.updateByShortName('ANY', newValue)
      expect(updated).toBe(true)
    })
    test('should return throw on update a shortName to an existent shortName', async () => {
      const sut = makeSut()
      await sut.add(makeFakeCurrency())
      await sut.add({ ...makeFakeCurrency(), shortName: 'ANY2' })
      const promise = sut.updateByShortName('ANY2', makeFakeCurrency())
      await expect(promise).rejects.toThrowError(/E11000 duplicate key error collection/)
    })
  })
})
