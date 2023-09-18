import { ConvertCurrencyService } from '../../services/convertCurrency.service.js'
import CurrencyMongoRepository from '../../database/currencyMongoRepository.js'
import { schemaValidatorConvert } from '../../utils/schemaValidator.js'

export class ConvertCurrencyController {
  async handler (req, res, next) {
    const { from, to, amount } = req.query
    try {
      await schemaValidatorConvert.validateAsync({ from, to, amount })
    } catch (error) {
      return res.status(400).json({ error: error.message.replace(/['"]/g, '') })
    }
    const convert = new ConvertCurrencyService(CurrencyMongoRepository)
    try {
      const response = await convert.execute({ from, to, amount: Number(amount) })
      return res.status(200).json({ converted: response })
    } catch (error) {
      next(error)
    }
  }
}
