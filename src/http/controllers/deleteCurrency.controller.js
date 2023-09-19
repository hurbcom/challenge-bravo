import CurrencyMongoRepository from '../../database/currencyMongoRepository.js'
import { DeleteCurrencyService } from '../../services/deleteCurrency.service.js'

export class DeleteCurrencyController {
  async handler (req, res, next) {
    const code = req.params.code

    const deleteCurrency = new DeleteCurrencyService(CurrencyMongoRepository)
    try {
      await deleteCurrency.execute(code.toUpperCase())
      return res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }
}
