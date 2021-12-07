import { DbDeleteCurrency } from '../../../../data/usecases/db-delete-currency'
import { RemoveCurrency } from '../../../../domain/usecases/delete-currency'
import { CurrencyMongoRepository } from '../../../../infra/db/mongodb/repositories/currency/currency-mongo-repository'

export const makeDbDeleteCurrency = ():RemoveCurrency => {
  return new DbDeleteCurrency(new CurrencyMongoRepository())
}
