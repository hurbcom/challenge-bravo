import { MongoClient } from 'mongodb'
import CurrencyMongoMappers from './currencyMongoMapper.js'

class CurrencyMongoRepository {
  #client
  #db
  #collection

  async connect (databaseUrl = null) {
    try {
      this.#client = new MongoClient(databaseUrl || 'mongodb://root:root@localhost:27017')
      await this.#client.connect()
      this.#db = this.#client.db('bravo')
      this.#collection = this.#db.collection('currency')
      console.log('successfully connecting')
    } catch (error) {
      throw new Error(error)
    }

    return true
  }

  async disconnect () {
    this.#client.close()
  }

  async getCurrencies (code = null) {
    try {
      if (code) {
        const currency = await this.#collection.find({ code }).toArray()
        if (!currency.length) return false
        return CurrencyMongoMappers.toDomain(currency)
      }
      const currencies = await this.#collection.find({}).toArray()

      return CurrencyMongoMappers.toDomain(currencies)
    } catch (error) {
      throw new Error(error)
    }
  }

  async registerCurrency (currency) {
    const { base, code, price } = currency

    try {
      const result = await this.#collection.insertOne({ base, code, price })
      return result.insertedId
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateCurrency (currency) {
    const { base, code, updated, price } = currency
    const query = { base, code }
    const update = { $set: { price, updated } }
    const options = { upsert: true }
    try {
      const updateResult = await this.#collection.updateOne(query, update, options)
      return updateResult
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteCurrency (code) {
    try {
      const deleteResult = await this.#collection.deleteOne({ code })
      if (!deleteResult.deletedCount) return false

      return true
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default new CurrencyMongoRepository()
