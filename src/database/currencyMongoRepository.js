import { Connection } from './connection/connection.js'

class CurrencyMongoRepository extends Connection {
  #collection
  constructor () {
    super()
    this.#collection = Connection.db.collection('currency')
  }

  async getCurrencies (code = null) {
    try {
      if (code) {
        const [currency] = await this.#collection.find({ code }).toArray()
        if (!currency) return false
        return currency
      }
      const currencies = await this.#collection.find({}).toArray()

      return currencies
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
    const { base, code, price } = currency
    const query = { base, code }
    const update = { $set: { price } }
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
      return !!deleteResult.deletedCount
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteMany () {
    const deleteManyResult = await this.#collection.deleteMany({})

    return deleteManyResult
  }
}

export { CurrencyMongoRepository }
