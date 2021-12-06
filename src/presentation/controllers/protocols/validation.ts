export interface Validation {
  validate(input: any): Promise<Error>
}
