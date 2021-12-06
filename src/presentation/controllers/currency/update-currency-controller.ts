import { UpdateCurrency } from '../../../domain/usecases/update-currency'
import { BusinessRuleError } from '../../errors/business-rule-error'
import { accepted, badRequest, ok, serverError } from '../../helpers/http'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Controller } from '../protocols/controller'
import { Validation } from '../protocols/validation'

export class UpdateCurrencyController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly updateCurrency: UpdateCurrency
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, shortName, USDvalue } = httpRequest.body
      const key = httpRequest.params.shortName
      const updateObj = { name, shortName: (shortName as string).toUpperCase(), USDvalue }
      Object.keys(updateObj).forEach(key => (updateObj[key] === undefined || updateObj[key] === null) && delete updateObj[key])

      const added = await this.updateCurrency.update(key, updateObj)
      if (added) return ok({})
    } catch (e) {
      if (e instanceof BusinessRuleError) return badRequest(e)
      return serverError(e)
    }

    return accepted({ message: 'no data was updated!' })
  }
}
