import { Validation } from '../../presentation/controllers/protocols/validation'
import { InvalidParamError } from '../../presentation/errors/invalid-param-error'

export class StringWithoutSpaceValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  async validate (input: any): Promise<Error> {
    await new Promise(resolve => resolve(true))
    if ((input[this.fieldName] as string).includes(' ')) {
      return new InvalidParamError(this.fieldName + ' must not contain spaces')
    }
  }
}
