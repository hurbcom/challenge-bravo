import { MongoServerError } from 'mongodb'
import { AddCurrencyRepository } from '../../../../../data/protocols/db/currency/add-currency-repository'
import { DeleteCurrencyRepository } from '../../../../../data/protocols/db/currency/delete-currency-repository'
import { GetCurrencyRepository } from '../../../../../data/protocols/db/currency/get-currency-repository'
import { ListCurrencyRepository } from '../../../../../data/protocols/db/currency/list-currency-repository'
import { UpdateCurrencyRepository } from '../../../../../data/protocols/db/currency/update-currency-repository'
import { UpsertCurrencyRepository } from '../../../../../data/protocols/db/currency/upsert-currency-repository'
import { CurrencyDocument, CurrencyModel } from '../../../../../domain/models/currency'
import { BusinessRuleError } from '../../../../../presentation/errors/business-rule-error'
import { MongoHelper } from '../../helpers/mongo-helper'

export class CurrencyMongoRepository implements AddCurrencyRepository, UpsertCurrencyRepository, UpdateCurrencyRepository, DeleteCurrencyRepository, GetCurrencyRepository, ListCurrencyRepository {
    public static readonly currencyCollection = 'curencies'

    constructor () {
      MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection).then((collection) => {
        collection.createIndex({ shortName: 1 }, { unique: true }).then(() => {})
      })
    }

    async add (currency: CurrencyModel): Promise<boolean> {
      try {
        const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
        const result = await collection.insertOne(currency)
        return result.acknowledged
      } catch (e) {
        if (e instanceof MongoServerError) {
          if (e.code === 11000) {
            throw new BusinessRuleError('Duplicated key: shortName.')
          }
        }
        throw e
      }
    }

    async upsert (currency: CurrencyModel): Promise<boolean> {
      const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
      const result = await collection.findOneAndUpdate({ shortName: currency.shortName }, { $set: { ...currency } }, { upsert: true })
      return result.ok === 1
    }

    async updateByShortName (shortName: string, update: CurrencyModel): Promise<boolean> {
      try {
        const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
        const result = await collection.findOneAndUpdate({ shortName }, { $set: { ...update } })
        return result.ok === 1
      } catch (e) {
        if (e instanceof MongoServerError) {
          if (e.code === 11000) {
            throw new BusinessRuleError('Duplicated key: shortName.')
          }
        }
        throw e
      }
    }

    async deleteByShortName (shortName: string): Promise<boolean> {
      const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
      const result = await collection.findOneAndDelete({ shortName })
      return result.ok === 1
    }

    async getByShortName (shortName: string): Promise<CurrencyDocument> {
      const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
      const result = await collection.findOne({ shortName })
      return result ? MongoHelper.map(result) : null
    }

    async listAll (): Promise<CurrencyModel[]> {
      const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
      const result = await collection.find().toArray()
      const parsedResult = []
      result.forEach((doc) => {
        parsedResult.push(MongoHelper.map(doc))
      })
      return parsedResult
    }
}
