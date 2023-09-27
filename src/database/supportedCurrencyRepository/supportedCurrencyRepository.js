import { Connection } from '../connection/connection.js'

class SupportedCurrencyRepository extends Connection {
  #collection
  constructor () {
    super()
    this.#collection = Connection.db.collection('supported_currency')
  }

  async registerSupportedCurrency (code) {
    try {
      await this.#collection.updateOne({ base: 'USD' }, { $push: { supported_currencies: code } }, { upsert: true })
      return true
    } catch (error) {
      throw error
    }
  }

  async addSupportedCurrencies (supportedCurrencies) {
    try {
      await this.#collection.insertOne(supportedCurrencies)
      return true
    } catch (error) {
      throw error
    }
  }

  async deleteSupportedCurrency (code) {
    try {
      const deleteResult = await this.#collection.updateOne(
        { base: 'USD' },
        { $pull: { supported_currencies: code } }
      )
      if (!deleteResult.deletedCount) return false

      return true
    } catch (error) {
      throw error
    }
  }

  async getSupportedCurrencies () {
    try {
      const currencies = await this.#collection.find({}).toArray()
      return currencies
    } catch (error) {
      throw error
    }
  }
}

export { SupportedCurrencyRepository }
