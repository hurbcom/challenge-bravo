import { Validation } from '../../presentation/controllers/protocols/validation'
import { MissingParamError } from '../../presentation/errors/missing-param-error'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) { }

  validate (input: any): Promise<Error> {
    if (!input[this.fieldName]) {
      return new Promise(resolve => resolve(new MissingParamError(this.fieldName)))
    }
  }
}
