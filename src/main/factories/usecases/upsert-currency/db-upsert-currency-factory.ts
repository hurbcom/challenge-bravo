import { DbUpsertCurrency } from '../../../../data/usecases/db-upsert-currency'
import { UpsertCurrency } from '../../../../domain/usecases/upsert-currency'
import { CurrencyMongoRepository } from '../../../../infra/db/mongodb/repositories/currency/currency-mongo-repository'

export const makeDbUpsertCurrency = ():UpsertCurrency => {
  return new DbUpsertCurrency(new CurrencyMongoRepository())
}
