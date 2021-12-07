import { RemoveCurrency } from '../../../domain/usecases/delete-currency'
import { ok, serverError } from '../../helpers/http'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Controller } from '../protocols/controller'

export class DeleteCurrencyController implements Controller {
  constructor (
    private readonly deleteCurrency: RemoveCurrency
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      let shortName = httpRequest.params.shortName
      shortName = (shortName as string).toUpperCase()
      const deleted = await this.deleteCurrency.delete(shortName)
      return ok({ deleted })
    } catch (e) {
      return serverError(e)
    }
  }
}
