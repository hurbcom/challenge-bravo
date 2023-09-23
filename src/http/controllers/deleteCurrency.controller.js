import { CurrencyMongoRepository } from '../../database/currencyMongoRepository.js'
import { DeleteCurrencyService } from '../../services/deleteCurrency.service.js'

export class DeleteCurrencyController {
  async handler (req, res, next) {
    const code = req.params.code
    const currencyRepository = new CurrencyMongoRepository()
    const deleteCurrency = new DeleteCurrencyService(currencyRepository)
    try {
      await deleteCurrency.execute(code.toUpperCase())
      return res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }
}
