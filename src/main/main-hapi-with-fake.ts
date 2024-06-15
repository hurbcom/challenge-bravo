import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
import env from '@/env';
import {
  ConvertCurrencyController,
  CreateCurrencyController,
  CurrenciesRoutes,
  DeleteCurrencyController,
  GetCurrencyByCodeController,
  HapiAdapter,
} from '@/infra/http-server/';
import { CurrencyRateRepositoryFake } from '@/infra/repository/';

const httpServer = new HapiAdapter();
const currencyRateRepository = new CurrencyRateRepositoryFake();
const createCurrencyRate = new CreateCurrencyRate(currencyRateRepository);
const convertCurrency = new ConvertCurrency(currencyRateRepository);
const getCurrencyByCode = new GetCurrencyRateByCode(currencyRateRepository);
const deleteCurrencyRateByCode = new DeleteCurrencyRateByCode(
  currencyRateRepository
);
const createCurrencyController = new CreateCurrencyController(
  createCurrencyRate
);
const convertCurrencyController = new ConvertCurrencyController(
  convertCurrency
);
const getCurrencyByCodeController = new GetCurrencyByCodeController(
  getCurrencyByCode
);
const deleteCurrencyController = new DeleteCurrencyController(
  deleteCurrencyRateByCode
);
const currencyRoutes = new CurrenciesRoutes({
  createCurrencyController,
  convertCurrencyController,
  getCurrencyByCodeController,
  deleteCurrencyController,
});
currencyRoutes.registerRoutes(httpServer);
httpServer.listen(env.HTTP_SERVER_PORT);
