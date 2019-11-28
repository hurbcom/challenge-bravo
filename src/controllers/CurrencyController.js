import Currency from '../models/Currency'
import api from '../services/api'

import config from '../config'

class CurrencyController {
  async convert (req, res) {
    try {
      const { from, to, amount } = req.query

      if (!await Currency.findOne({ currency: from })) {
        return res.status(404).json({ message: 'From currency not found' })
      }

      if (!await Currency.findOne({ currency: to })) {
        return res.status(404).json({ message: 'To currency not found' })
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
      return res.status(500).json({ message: error.message })
    }
  }

  async add (req, res) {
    try {
      const currency = await Currency.create(req.body)

      return res.status(201).json(currency)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async remove (req, res) {
    try {
      await Currency.findOneAndRemove({ _id: req.params.id })

      return res.status(204).json({ deleted: true })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export default new CurrencyController()
