import { GetCurrencyByCodeQuery } from '@/application/query';
import { ListCurrenciesQuery } from '@/application/query/list-currencies-query';
import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
} from '@/application/use-case/';
import { PgPromiseAdapter } from '@/infra/database/';
import {
  ConvertCurrencyController,
  CreateCurrencyController,
  DeleteCurrencyController,
  ExpressAdapter,
  GetCurrencyByCodeQueryController,
  ListCurrenciesController,
} from '@/infra/http-server/';
import { CurrencyRateRepositoryDatabase } from '@/infra/repository/';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const listCurrencies = new ListCurrenciesQuery(connection);
const currencyRateRepository = new CurrencyRateRepositoryDatabase(connection);
const createCurrencyRate = new CreateCurrencyRate(currencyRateRepository);
const convertCurrency = new ConvertCurrency(currencyRateRepository);
// const getCurrencyRateByCode = new GetCurrencyRateByCode(currencyRateRepository);
const getCurrencyByCodeQuery = new GetCurrencyByCodeQuery(connection);
const deleteCurrencyRateByCode = new DeleteCurrencyRateByCode(
  currencyRateRepository
);
new ListCurrenciesController(httpServer, listCurrencies);
new CreateCurrencyController(httpServer, createCurrencyRate);
new ConvertCurrencyController(httpServer, convertCurrency);
new GetCurrencyByCodeQueryController(httpServer, getCurrencyByCodeQuery);
new DeleteCurrencyController(httpServer, deleteCurrencyRateByCode);
httpServer.listen(3000);
