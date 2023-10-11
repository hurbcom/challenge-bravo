import { ConvertCurrencyService } from '../../services/convertCurrency.service.js'
import { CurrencyMongoRepository } from '../../database/currencyMongoRepository.js'

export class ConvertCurrencyController {
  async handler (req, res, next) {
    const { from, to, amount } = req.query
    const currencyRepository = new CurrencyMongoRepository()
    const convert = new ConvertCurrencyService(currencyRepository)
    try {
      const response = await convert.execute({ from, to, amount: Number(amount) })
      return res.status(200).json({ converted: response })
    } catch (error) {
      next(error)
    }
  }
}
