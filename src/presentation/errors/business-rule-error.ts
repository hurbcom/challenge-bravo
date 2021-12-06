export class BusinessRuleError extends Error {
  constructor (error?:string) {
    super(`Business Rule Error! ${error}`)
    this.name = 'BusinessRuleError'
  }
}
