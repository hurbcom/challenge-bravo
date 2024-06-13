import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
import { CurrenciesApiGatewayOnline } from '@/infra/gateway';
import { AxiosAdapter } from '@/infra/http-client';
import { CurrencyController, ExpressAdapter } from '@/infra/http-server/';
import { CurrencyRateRepositoryApi } from '@/infra/repository/';

const httpServer = new ExpressAdapter();
// const currencyGateway = new CurrenciesApiGatewayStatic()
const httpClient = new AxiosAdapter();
const currencyGateway = new CurrenciesApiGatewayOnline(httpClient);
const currencyRateRepository = new CurrencyRateRepositoryApi(currencyGateway);
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
httpServer.listen(3000);
