import { GetCurrencyByCodeQuery } from '@/application/query';
import { ListCurrenciesQuery } from '@/application/query/';
import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
} from '@/application/use-case/';
import env from '@/env';
import { PgPromiseAdapter } from '@/infra/database/';
import {
  ConvertCurrencyController,
  CreateCurrencyController,
  CurrenciesRoutes,
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
const currencyRoutes = new CurrenciesRoutes({
  listCurrenciesController,
  createCurrencyController,
  convertCurrencyController,
  getCurrencyByCodeController,
  deleteCurrencyController,
});
currencyRoutes.registerRoutes(httpServer);
httpServer.listen(env.HTTP_SERVER_PORT);
