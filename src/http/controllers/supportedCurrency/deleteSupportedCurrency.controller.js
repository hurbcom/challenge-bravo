import { SupportedCurrencyRepository } from '../../../database/supportedCurrencyRepository/supportedCurrencyRepository.js'
import { CurrencyMongoRepository } from '../../../database/currencyMongoRepository.js'
import { DeleteCurrencyService } from '../../../services/deleteCurrency.service.js'
import { DeleteSupportedCurrencyService } from '../../../services/supportedCurrenciesService/deleteSupportedCurrency.service.js'

class DeleteSupportedCurrencyController {
  async handler (req, res, next) {
    const currencyRepository = new CurrencyMongoRepository()
    const deleteCurrencyService = new DeleteCurrencyService(currencyRepository)

    const supportedCurrencyRepository = new SupportedCurrencyRepository()
    const deleteSupportedCurrencyService = new DeleteSupportedCurrencyService(supportedCurrencyRepository, deleteCurrencyService)

    const { code } = req.params
    try {
      await deleteSupportedCurrencyService.execute(code.toUpperCase())
      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }
}

export { DeleteSupportedCurrencyController }
