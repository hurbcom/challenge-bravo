import { GetCurrency } from '../../../domain/usecases/get-currency'
import { Validation } from '../../../presentation/controllers/protocols/validation'
import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'

export class CurrencyShortNameValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly getCurrency: GetCurrency) { }

  async validate (input: any): Promise<Error> {
    if (input[this.fieldName]) {
      const exists = await this.getCurrency.getByShortName((input[this.fieldName]as string).toUpperCase())
      if (!exists) {
        return new InvalidParamError(this.fieldName)
      }
    }
  }
}
