import Currency from '../models/Currency'
import api from '../services/api'

import config from '../config'

class CurrencyController {
  /**
   * Convert currencies
   * @param {String} from
   * @param {String} to
   * @param {Number} amount
   *
   * @return {Object}
   */
  async convert (req, res) {
    try {
      const { from, to, amount } = req.query

      if (!await Currency.findOne({ currency: from })) {
        return res.sendError({ message: 'From currency not found' }, 404)
      }

      if (!await Currency.findOne({ currency: to })) {
        return res.sendError({ message: 'To currency not found' }, 404)
      }

      const q = `${from}_${to}`

      const { data } = await api.get('/convert', {
        params: {
          apiKey: config.services.api_key,
          q,
          compact: 'ultra'
        }
      })

      return res.json({ result: data[q] * amount })
    } catch (error) {
      return res.sendError({ message: error.message })
    }
  }

  /**
   * Add new currency
   * @param {Object}
   *
   * @return {Object}
   */
  async add (req, res) {
    try {
      const currency = await Currency.create(req.body)

      return res.status(201).json(currency)
    } catch (error) {
      return res.sendError({ message: error.message })
    }
  }

  /**
   * Remove a currency
   * @param {ObjectId} id
   *
   * @return {Void}
   */
  async remove (req, res) {
    try {
      await Currency.findOneAndRemove({ _id: req.params.id })

      return res.status(204).send()
    } catch (error) {
      return res.sendError({ message: error.message })
    }
  }
}

export default new CurrencyController()
