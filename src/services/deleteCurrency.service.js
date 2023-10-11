import { NotFoundError } from '../utils/apiError.js'

export class DeleteCurrencyService {
  #currencyRepository
  /**
   *
   * @param {InstanceType} currencyRepository
   */
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  /**
   *
   * @param {Uppercase<string>} code
   * @returns {Promise<boolean>}
   */
  async execute (code) {
    const deleteResult = await this.#currencyRepository.deleteCurrency(code)
    if (!deleteResult) {
      throw new NotFoundError('Currency not found')
    }

    return true
  }
}
