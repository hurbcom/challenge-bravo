import { Validation } from '../../presentation/controllers/protocols/validation'
import { InvalidParamError } from '../../presentation/errors/invalid-param-error'

export class NumericFieldValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly maxSize?:number, private readonly minSize?:number) {}

  async validate (input: any): Promise<Error> {
    await new Promise(resolve => resolve(true))
    const asNum = Number(input[this.fieldName])
    if (isNaN(asNum)) {
      return new InvalidParamError(this.fieldName)
    }
    if (this.minSize && asNum.toString().length < this.minSize) {
      return new InvalidParamError(this.fieldName)
    }
    if (this.maxSize && asNum.toString().length > this.maxSize) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
