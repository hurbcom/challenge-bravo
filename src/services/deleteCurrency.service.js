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
    const deleteResult = await this.#currencyRepository.deleteCurrency(code)
    if (!deleteResult) {
      throw new NotFoundError('Currency not found')
    }

    return true
  }
}
