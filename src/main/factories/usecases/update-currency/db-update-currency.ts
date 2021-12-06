import { DbUpdateCurrency } from '../../../../data/usecases/db-update-currency'
import { UpdateCurrency } from '../../../../domain/usecases/update-currency'
import { CurrencyMongoRepository } from '../../../../infra/db/mongodb/repositories/currency/currency-mongo-repository'

export const makeDbUpdateCurrency = (): UpdateCurrency => {
  return new DbUpdateCurrency(new CurrencyMongoRepository())
}
