import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
// import { CurrenciesApiGatewayOnline } from '@/infra/gateway';
import { CurrenciesApiGatewayStatic } from '@/infra/gateway';
import {
  ConvertCurrencyController,
  CreateCurrencyController,
  DeleteCurrencyController,
  ExpressAdapter,
  GetCurrencyByCodeController,
} from '@/infra/http-server/';
import { CurrencyRateRepositoryApi } from '@/infra/repository/';

const httpServer = new ExpressAdapter();
// const httpClient = new AxiosAdapter();
const currencyGateway = new CurrenciesApiGatewayStatic();
const currencyRateRepository = new CurrencyRateRepositoryApi(currencyGateway);
const createCurrencyRate = new CreateCurrencyRate(currencyRateRepository);
const convertCurrency = new ConvertCurrency(currencyRateRepository);
const getCurrencyByCode = new GetCurrencyRateByCode(currencyRateRepository);
const deleteCurrencyRateByCode = new DeleteCurrencyRateByCode(
  currencyRateRepository
);
new CreateCurrencyController(httpServer, createCurrencyRate);
new ConvertCurrencyController(httpServer, convertCurrency);
new GetCurrencyByCodeController(httpServer, getCurrencyByCode);
new DeleteCurrencyController(httpServer, deleteCurrencyRateByCode);
httpServer.listen(3000);
