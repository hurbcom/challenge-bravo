import { GetCurrencyRepository } from '../../../data/protocols/db/currency/get-currency-repository'
import { Validation } from '../../../presentation/controllers/protocols/validation'
import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'

export class CurrencyShortNameValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly repository: GetCurrencyRepository) { }

  async validate (input: any): Promise<Error> {
    if (input[this.fieldName]) {
      const exists = await this.repository.getByShortName((input[this.fieldName]as string).toUpperCase())
      if (!exists) {
        return new InvalidParamError(this.fieldName)
      }
    }
  }
}
