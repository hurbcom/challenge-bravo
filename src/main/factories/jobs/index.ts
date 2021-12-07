import { makeUpdateCurrenciesUsingExternalService } from './update-currencies-using-external-service-factory'

export const scheduledJobs = [
  makeUpdateCurrenciesUsingExternalService()
]
