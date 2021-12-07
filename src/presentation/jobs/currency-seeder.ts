import { AddCurrency } from '../../domain/usecases/add-currency'
import { ListCurrencies } from '../../domain/usecases/list-currencies'
import { Job } from '../../main/scheduled/jobs/protocols/job'

export class CurrencySeeder implements Job {
  constructor (
      public readonly schedule:string|Date,
      protected readonly listLocalCurrencies: ListCurrencies,
      protected readonly listExternalCurrencies: ListCurrencies,
      protected readonly addCurrency: AddCurrency
  ) {}

  async handle (input?: any): Promise<void> {
    try {
      const list = await this.listLocalCurrencies.list()
      if (list.length === 0) {
        const currencies = await this.listExternalCurrencies.list()
        currencies.forEach((currency) => {
          this.addCurrency.add(currency).catch(e => {})
        })
        console.log('currency collection seeded')
      }
    } catch (e) {
      console.error(e)
    }
  }

  getName (): string {
    return 'Currency Seeder'
  }
}
