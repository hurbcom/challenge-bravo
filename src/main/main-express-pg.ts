import { ListCurrenciesQuery } from '@/application/query/list-currencies-query';
import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
import { PgPromiseAdapter } from '@/infra/database/';
import { CurrencyController, ExpressAdapter } from '@/infra/http-server/';
import ListCurrenciesController from '@/infra/http-server/list-currencies.controller';
import { CurrencyRateRepositoryDatabase } from '@/infra/repository/';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const currencyRateRepository = new CurrencyRateRepositoryDatabase(connection);
const currencyConverter = new ConvertCurrency(currencyRateRepository);
const createCurrencyRate = new CreateCurrencyRate(currencyRateRepository);
const getCurrencyRateByCode = new GetCurrencyRateByCode(currencyRateRepository);
const deleteCurrencyRateByCode = new DeleteCurrencyRateByCode(
  currencyRateRepository
);
new CurrencyController(
  httpServer,
  currencyConverter,
  createCurrencyRate,
  getCurrencyRateByCode,
  deleteCurrencyRateByCode
);
const listCurrencies = new ListCurrenciesQuery(connection);
new ListCurrenciesController(httpServer, listCurrencies);
httpServer.listen(3000);
