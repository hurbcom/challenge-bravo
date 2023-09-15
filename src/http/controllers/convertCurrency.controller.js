import { ConvertCurrencyService } from '../../services/convertCurrency.service.js'
import { InMemoryCurrencyRepository } from '../../../tests/repository/inMemoryCurrencyRepository.js'

export class ConvertCurrencyController {
  async handler (req, res, next) {
    const { from, to, amount } = req.query

    const currencyRepository = new InMemoryCurrencyRepository()
    const convert = new ConvertCurrencyService(currencyRepository)
    const response = await convert.execute({ from, to, amount: Number(amount) })

    return res.status(200).json({ converted: response })
  }
}
