import { AddCurrencyRepository } from '../../../../../data/protocols/db/currency/add-currency-repository'
import { UpsertCurrencyRepository } from '../../../../../data/protocols/db/currency/upsert-currency-repository'
import { CurrencyModel } from '../../../../../domain/models/currency'
import { MongoHelper } from '../../helpers/mongo-helper'

export class CurrencyMongoRepository implements AddCurrencyRepository, UpsertCurrencyRepository {
    public static readonly currencyCollection = 'curencies'

    async add (currency: CurrencyModel): Promise<boolean> {
      const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
      const result = await collection.insertOne(currency)
      return result.acknowledged
    }

    async upsert (currency: CurrencyModel): Promise<boolean> {
      const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
      const result = await collection.findOneAndUpdate({ shortName: currency.shortName }, { $set: { ...currency } }, { upsert: true })
      return result.ok === 1
    }
}
