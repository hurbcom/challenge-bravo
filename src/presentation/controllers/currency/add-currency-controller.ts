import { AddCurrency } from '../../../domain/usecases/add-currency'
import { accepted, badRequest, created, serverError } from '../../helpers/http'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Controller } from '../protocols/controller'
import { Validation } from '../protocols/validation'

export class AddCurrencyController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly addCurrency: AddCurrency
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, shortName, USDvalue } = httpRequest.body

      const added = await this.addCurrency.add({ name, shortName: (shortName as string).toUpperCase(), USDvalue })
      if (added) return created({})
    } catch (e) {
      return serverError(e)
    }

    return accepted({ message: 'not created. try again, later.' })
  }
}
