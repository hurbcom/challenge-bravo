import { GetCurrency } from '../../../domain/usecases/get-currency'
import { badRequest, ok, serverError } from '../../helpers/http'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Controller } from '../protocols/controller'
import { Validation } from '../protocols/validation'

export class ConvertCurrencyController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly getCurrency: GetCurrency
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest.query)

      if (error) {
        return badRequest(error)
      }

      const { from, to, amount } = httpRequest.query

      const first = await this.getCurrency.getByShortName(from)
      const valueAsUSD = amount / first.USDvalue
      const second = await this.getCurrency.getByShortName(to)
      const result = Number.parseFloat((valueAsUSD * second.USDvalue).toFixed(2))
      return ok({ result })
    } catch (e) {
      return serverError(e)
    }
  }
}
