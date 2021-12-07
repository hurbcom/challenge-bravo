import { GetCurrency } from '../../../domain/usecases/get-currency'
import { ListCurrencies } from '../../../domain/usecases/list-currencies'
import { ok, serverError } from '../../helpers/http'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { Controller } from '../protocols/controller'

export class GetCurrencyController implements Controller {
  constructor (
    private readonly getCurrency: GetCurrency,
    private readonly listCurrency: ListCurrencies
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      let shortName = httpRequest.params?.shortName || undefined
      if (shortName) {
        shortName = (shortName as string).toUpperCase()
        const search = await this.getCurrency.getByShortName(shortName)
        return ok(search)
      }
      const list = await this.listCurrency.list()
      return ok(list)
    } catch (e) {
      return serverError(e)
    }
  }
}
