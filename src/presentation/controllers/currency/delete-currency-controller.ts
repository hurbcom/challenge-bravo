import { RemoveCurrency } from '../../../domain/usecases/delete-currency'
import { BusinessRuleError } from '../../errors/business-rule-error'
import { badRequest, ok, serverError } from '../../helpers/http'
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
      // we cannot delete our base coin
      if (shortName === 'USD') return badRequest(new BusinessRuleError('USD cannot be deleted'))

      const deleted = await this.deleteCurrency.delete(shortName)
      return ok({ deleted })
    } catch (e) {
      return serverError(e)
    }
  }
}
