import CurrencyMongoMappers from './currencyMongoMapper.js'
import { Connection } from './connection/connection.js'

class CurrencyMongoRepository extends Connection {
  async getCurrencies (code = null) {
    try {
      if (code) {
        const currency = await Connection.db.collection('currency').find({ code }).toArray()
        if (!currency.length) return false
        return CurrencyMongoMappers.toDomain(currency)
      }
      const currencies = await Connection.db.collection('currency').find({}).toArray()

      return CurrencyMongoMappers.toDomain(currencies)
    } catch (error) {
      throw new Error(error)
    }
  }

  async registerCurrency (currency) {
    const { base, code, price } = currency

    try {
      const result = await Connection.db.collection('currency').insertOne({ base, code, price })
      return result.insertedId
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateCurrency (currency) {
    const { base, code, price } = currency
    const query = { base, code }
    const update = { $set: { price } }
    const options = { upsert: true }
    try {
      const updateResult = await Connection.db.collection('currency').updateOne(query, update, options)
      return updateResult
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteCurrency (code) {
    try {
      const deleteResult = await Connection.db.collection('currency').deleteOne({ code })
      if (!deleteResult.deletedCount) return false

      return true
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateSupportCurrency (code) {
    try {
      const response = await Connection.db.collection('supported_currency').updateOne({ base: 'USD' }, { $push: { code } }, { upsert: true })
      return response
    } catch (error) {
      throw error
    }
  }

  async deleteSupportCurrency (code) {
    try {
      const response = await Connection.db.collection('supported_currency').updateOne(
        { base: 'USD' },
        { $pull: { supported_currencies: code } }
      )
      return response
    } catch (error) {
      throw error
    }
  }
}

export { CurrencyMongoRepository }
