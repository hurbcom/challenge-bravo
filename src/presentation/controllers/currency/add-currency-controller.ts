import { AddCurrency } from '../../../domain/usecases/add-currency'
import { BusinessRuleError } from '../../errors/business-rule-error'
import { accepted, badRequest, created } from '../../helpers/http'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Controller } from '../protocols/controller'
import { Validation } from '../protocols/validation'

export class AddCurrencyController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly addCurrency: AddCurrency
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = await this.validator.validate(httpRequest.body)

    if (error) {
      return badRequest(error)
    }

    const { name, shortName, USDvalue } = httpRequest.body

    try {
      const added = await this.addCurrency.add({ name, shortName: (shortName as string).toUpperCase(), USDvalue })
      if (added) return created({})
    } catch (e) {
      if (e instanceof BusinessRuleError) return badRequest(e)
      throw e
    }

    return accepted({ message: 'not created. try again, later.' })
  }
}
