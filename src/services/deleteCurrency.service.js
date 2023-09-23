import { NotFoundError } from '../utils/apiError.js'

export class DeleteCurrencyService {
  #currencyRepository
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  /*
  code: string
   */
  async execute (code) {
    const currency = await this.#currencyRepository.getCurrencies(code)
    if (!currency) throw new NotFoundError('Currency not found')

    await this.#currencyRepository.deleteCurrency(code)

    return true
  }
}
