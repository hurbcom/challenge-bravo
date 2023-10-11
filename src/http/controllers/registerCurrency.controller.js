import { RegisterCurrencyService } from '../../services/registerCurrency.service.js'
import { CurrencyMongoRepository } from '../../database/currencyMongoRepository.js'

export class RegisterCurrencyController {
  async handler (req, res, next) {
    const { code, price } = req.body

    try {
      const currencyRepository = new CurrencyMongoRepository()
      const registerCurrencyService = new RegisterCurrencyService(currencyRepository)

      const response = await registerCurrencyService.execute({ code, price: typeof price !== 'number' ? Number(price) : price })
      return res.status(201).json({ id: response })
    } catch (error) {
      next(error)
    }
  }
}
