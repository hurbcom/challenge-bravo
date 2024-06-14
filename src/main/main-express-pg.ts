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
const listCurrenciesController = new ListCurrenciesController(listCurrencies);
const createCurrencyController = new CreateCurrencyController(
  createCurrencyRate
);
const convertCurrencyController = new ConvertCurrencyController(
  convertCurrency
);
const getCurrencyByCodeController = new GetCurrencyByCodeQueryController(
  getCurrencyByCodeQuery
);
const deleteCurrencyController = new DeleteCurrencyController(
  deleteCurrencyRateByCode
);
httpServer.register('get', '/currencies', listCurrenciesController);
httpServer.register('post', '/currencies', createCurrencyController);
httpServer.register('get', '/currencies/convert', convertCurrencyController);
httpServer.register('get', '/currencies/{code}', getCurrencyByCodeController);
httpServer.register('delete', '/currencies/{code}', deleteCurrencyController);
httpServer.listen(3000);
