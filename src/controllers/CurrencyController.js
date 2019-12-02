import { promisify } from 'util'

import Currency from '../models/Currency'

import api from '../services/api'
import client from '../services/redis'

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

  async convertCached (req, res) {
    try {
      const { from, to, amount } = req.query
      let fromQuotation, toQuotation

      const getValueRedis = promisify(client.get).bind(client)
      const setValuesRedis = promisify(client.set).bind(client)

      const query = {
        from: `${from}_USD`,
        to: `${to}_USD`
      }

      const reply = {
        from: await getValueRedis(query.from),
        to: await getValueRedis(query.to)
      }

      if (reply.from) {
        fromQuotation = parseFloat(reply.from.toString())
      } else {
        const { data } = await api.get('/convert', {
          params: {
            apiKey: config.services.api_key,
            q: query.from,
            compact: 'ultra'
          }
        })

        fromQuotation = data[query.from]

        await setValuesRedis(query.from, String(fromQuotation), 'EX', 60)
      }

      if (reply.to) {
        toQuotation = parseFloat(reply.to.toString())
      } else {
        const { data } = await api.get('/convert', {
          params: {
            apiKey: config.services.api_key,
            q: query.to,
            compact: 'ultra'
          }
        })

        toQuotation = data[query.to]

        await setValuesRedis(query.from, String(fromQuotation), 'EX', 60)
      }

      const result = fromQuotation * toQuotation * amount

      return res.json({ result })
    } catch (error) {
      res.sendError({ message: error.message })
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
