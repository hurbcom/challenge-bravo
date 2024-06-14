import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
import {
  ConvertCurrencyController,
  CreateCurrencyController,
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
new CreateCurrencyController(httpServer, createCurrencyRate);
new ConvertCurrencyController(httpServer, convertCurrency);
new GetCurrencyByCodeController(httpServer, getCurrencyByCode);
new DeleteCurrencyController(httpServer, deleteCurrencyRateByCode);
httpServer.listen(3000);
