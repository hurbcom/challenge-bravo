export interface Validation {
  // validatate sign as async to perform complex validations
  validate(input: any): Promise<Error>
}
