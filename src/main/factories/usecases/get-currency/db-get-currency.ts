import { DbGetCurrency } from '../../../../data/usecases/db-get-currency'
import { GetCurrency } from '../../../../domain/usecases/get-currency'
import { CurrencyMongoRepository } from '../../../../infra/db/mongodb/repositories/currency/currency-mongo-repository'

export const makeDbGetCurrency = ():GetCurrency => {
  const repository = new CurrencyMongoRepository()
  return new DbGetCurrency(repository)
}
