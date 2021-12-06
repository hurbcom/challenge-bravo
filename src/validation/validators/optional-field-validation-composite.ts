import { Validation } from '../../presentation/controllers/protocols/validation'

export interface MapFieldValidation{
    field:string,
    validation:Validation
}
export class OptionalFieldValidationComposite implements Validation {
  constructor (private readonly validations: MapFieldValidation[]) { }

  async validate (input: any): Promise<Error> {
    for (const validationMap of this.validations) {
      if (input[validationMap.field] !== undefined) {
        const error = await validationMap.validation.validate(input)
        return error
      }
    }
  }
}
