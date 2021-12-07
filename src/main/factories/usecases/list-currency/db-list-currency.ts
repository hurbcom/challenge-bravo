import { DbListCurrencies } from '../../../../data/usecases/db-list-currencies'
import { ListCurrencies } from '../../../../domain/usecases/list-currencies'
import { CurrencyMongoRepository } from '../../../../infra/db/mongodb/repositories/currency/currency-mongo-repository'

export const makeDbListCurrency = ():ListCurrencies => {
  const repository = new CurrencyMongoRepository()
  return new DbListCurrencies(repository)
}
