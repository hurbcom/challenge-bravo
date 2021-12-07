import { ListCurrencies } from '../../domain/usecases/list-currencies'
import { UpsertCurrency } from '../../domain/usecases/upsert-currency'
import { Job } from '../../main/scheduled/jobs/protocols/job'

export class UpdateCurrenciesUsingExternalService implements Job {
  constructor (public readonly schedule:string|Date, protected readonly listCurrencies: ListCurrencies, protected readonly upsertCurrency:UpsertCurrency) {}
  getName (): string {
    return 'Update Currencies Using External Service'
  }

  async handle (input?: any): Promise<void> {
    try {
      const currencies = await this.listCurrencies.list()
      currencies.forEach((currency) => {
        this.upsertCurrency.upsert(currency).catch(e => {})
      })
      console.log('currencies updated')
    } catch (e) {
      console.error(e)
    }
  }
}
