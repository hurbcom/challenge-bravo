import { RegisterSupportedCurrencyService } from '../../../services/supportedCurrenciesService/registerSupportedCurrency.service.js'
import { SupportedCurrencyRepository } from '../../../database/supportedCurrencyRepository/supportedCurrencyRepository.js'
import { AbstractApi } from '../../client/abstractAp.js'
import { RegisterCurrencyService } from '../../../services/registerCurrency.service.js'
import { CurrencyMongoRepository } from '../../../database/currencyMongoRepository.js'

class RegisterSupportedCurrencyController {
  async handler (req, res, next) {
    const supportedCurrenciesRepository = new SupportedCurrencyRepository()
    const currencyRepository = new CurrencyMongoRepository()
    const registerCurrencyService = new RegisterCurrencyService(currencyRepository)
    const resourceExtern = new AbstractApi()
    const registerSupportedCurrency = new RegisterSupportedCurrencyService(supportedCurrenciesRepository, registerCurrencyService, resourceExtern)

    const { code } = req.body
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'code must not be empty and different of string' })
    }
    try {
      await registerSupportedCurrency.execute(code)

      return res.sendStatus(201)
    } catch (error) {
      next(error)
    }
  }
}

export { RegisterSupportedCurrencyController }
