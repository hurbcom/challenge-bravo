import { RegisterCurrencyService } from '../../services/registerCurrency.service.js'
import CurrencyMongoDbRepository from '../../database/currencyMongoRepository.js'

export class RegisterCurrencyController {
  async handler (req, res, next) {
    const { code, price } = req.body

    try {
      const currencyRepository = new RegisterCurrencyService(CurrencyMongoDbRepository)

      const response = await currencyRepository.execute({ code, price: typeof price !== 'number' ? Number(price) : price })
      return res.status(201).json({ id: response })
    } catch (error) {
      next(error)
    }
  }
}
