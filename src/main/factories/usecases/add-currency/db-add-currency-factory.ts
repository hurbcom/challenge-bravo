import { DbAddCurrency } from '../../../../data/usecases/db-add-currency'
import { AddCurrency } from '../../../../domain/usecases/add-currency'
import { CurrencyMongoRepository } from '../../../../infra/db/mongodb/repositories/currency/currency-mongo-repository'

export const makeDbAddCurrency = ():AddCurrency => {
  const repository = new CurrencyMongoRepository()
  return new DbAddCurrency(repository)
}
