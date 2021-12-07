import { CronHelper } from '../../../presentation/helpers/cron-helper'
import { Job } from '../../scheduled/jobs/protocols/job'
import { UpdateCurrenciesUsingExternalService } from '../../../presentation/jobs/update-currencies-using-external-service'
import { makeServiceListCurrency } from '../usecases/list-currency/service-list-currency'
import { makeDbUpsertCurrency } from '../usecases/upsert-currency/db-upsert-currency-factory'

export const makeUpdateCurrenciesUsingExternalService = ():Job => {
  return new UpdateCurrenciesUsingExternalService(new CronHelper().every(30).seconds(), makeServiceListCurrency(), makeDbUpsertCurrency())
}
