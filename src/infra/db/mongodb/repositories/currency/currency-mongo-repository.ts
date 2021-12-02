import { AddCurrencyRepository } from '../../../../../data/protocols/db/currency/add-currency-repository'
import { CurrencyModel } from '../../../../../domain/models/currency'
import { MongoHelper } from '../../helpers/mongo-helper'

export class CurrencyMongoRepository implements AddCurrencyRepository {
    public static readonly currencyCollection = 'curencies'
    async add (currency: CurrencyModel): Promise<boolean> {
      const collection = await MongoHelper.getCollection(CurrencyMongoRepository.currencyCollection)
      const result = await collection.insertOne(currency)
      return result.acknowledged
    }
}
