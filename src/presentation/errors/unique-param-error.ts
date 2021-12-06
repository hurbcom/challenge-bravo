import { BusinessRuleError } from './business-rule-error'

export class UniqueParamError extends BusinessRuleError {
  constructor (param:string) {
    super(`Unique Param Error ${param}`)
    this.name = 'UniqueParamError'
  }
}
