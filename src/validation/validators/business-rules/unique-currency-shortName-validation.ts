import { GetCurrencyRepository } from '../../../data/protocols/db/currency/get-currency-repository'
import { Validation } from '../../../presentation/controllers/protocols/validation'
import { UniqueParamError } from '../../../presentation/errors/unique-param-error'

export class UniqueCurrencyShortNameValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly repository: GetCurrencyRepository) { }

  async validate (input: any): Promise<Error> {
    if (input[this.fieldName]) {
      const exists = await this.repository.getByShortName((input[this.fieldName]as string).toUpperCase())
      if (exists) {
        return new UniqueParamError(this.fieldName)
      }
    }
  }
}
