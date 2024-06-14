import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
import { CurrenciesApiGatewayStatic } from '@/infra/gateway';
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
const currencyGateway = new CurrenciesApiGatewayStatic();
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
