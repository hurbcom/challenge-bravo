import { CurrencySeeder } from '../../../presentation/jobs/currency-seeder'
import { Job } from '../../scheduled/jobs/protocols/job'
import { makeDbAddCurrency } from '../usecases/add-currency/db-add-currency-factory'
import { makeDbListCurrency } from '../usecases/list-currency/db-list-currency'
import { makeServiceListCurrency } from '../usecases/list-currency/service-list-currency'

export const makeCurrencySeeder = ():Job => {
  const now = new Date(Date.now())
  now.setSeconds(now.getSeconds() + 3)// waiting application starts
  return new CurrencySeeder(now, makeDbListCurrency(), makeServiceListCurrency(), makeDbAddCurrency())
}
