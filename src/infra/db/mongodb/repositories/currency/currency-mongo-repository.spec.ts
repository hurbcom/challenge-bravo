import { Collection } from 'mongodb'
import { CurrencyModel } from '../../../../../domain/models/currency'
import { MongoHelper } from '../../helpers/mongo-helper'
import { CurrencyMongoRepository } from './currency-mongo-repository'

let currencyCollection: Collection

describe('currency mongo repository', () => {
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
    test('should return true on add currency', async () => {
      const sut = makeSut()
      const result = await sut.add(makeFakeCurrency())
      expect(result).toBe(true)

      const dbCurrency = await currencyCollection.findOne({ shortName: makeFakeCurrency().shortName })
      expect(dbCurrency._id).toBeTruthy()
      expect(dbCurrency.name).toEqual('any currency')
      expect(dbCurrency.shortName).toEqual('ANY')
    })

    test('should throw on add duplicated currency', async () => {
      const sut = makeSut()
      await sut.add(makeFakeCurrency())
      const promise = sut.add(makeFakeCurrency())
      await expect(promise).rejects.toThrowError(/E11000 duplicate key error collection/)
    })
  })

  describe('upsert', () => {
    test('should return true on update currency', async () => {
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
    test('should return true on upsert currency that doesnt exists', async () => {
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
    test('should return true on update currency by shortName', async () => {
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

  describe('deleteByShortName', () => {
    test('should return true on delete currency by shortName', async () => {
      const sut = makeSut()
      await sut.add(makeFakeCurrency())
      const deleted = await sut.deleteByShortName('ANY')
      expect(deleted).toBe(true)

      const dbCurrency = await currencyCollection.findOne({ shortName: makeFakeCurrency().shortName })
      expect(dbCurrency).toBeFalsy()
    })
  })

  describe('getByShortName', () => {
    test('should return the currency on getByShortName success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeCurrency())
      const currency = await sut.getByShortName('ANY')
      expect(currency.id).toBeTruthy()
      expect(currency.name).toEqual('any currency')
      expect(currency.shortName).toEqual('ANY')
    })
    test('should return null if currency not found', async () => {
      const sut = makeSut()
      const currency = await sut.getByShortName('ANY')
      expect(currency).toBeNull()
    })
  })

  describe('listAll', () => {
    test('should return the currency list on success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeCurrency())
      const currencies = await sut.listAll()
      expect(currencies.length).not.toBe(0)
    })
    test('should return empty on empty database', async () => {
      const sut = makeSut()
      const currencies = await sut.listAll()
      expect(currencies).toEqual([])
    })
  })
})
