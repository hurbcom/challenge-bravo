import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
import { CurrenciesApiGatewayOnline } from '@/infra/gateway';
import { AxiosAdapter } from '@/infra/http-client';
import {
  ConvertCurrencyController,
  CreateCurrencyController,
  CurrenciesRoutes,
  DeleteCurrencyController,
  ExpressAdapter,
  GetCurrencyByCodeController,
} from '@/infra/http-server/';
import { CurrencyRateRepositoryApi } from '@/infra/repository/';

const httpServer = new ExpressAdapter();
const httpClient = new AxiosAdapter();
const currencyGateway = new CurrenciesApiGatewayOnline(httpClient);
const currencyRateRepository = new CurrencyRateRepositoryApi(currencyGateway);
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
httpServer.listen(3000);
