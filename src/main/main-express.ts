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
  ExpressAdapter,
  GetCurrencyByCodeController,
} from '@/infra/http-server/';
import { CurrencyRateRepositoryFake } from '@/infra/repository/';

const httpServer = new ExpressAdapter();
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
httpServer.register('post', '/currencies', createCurrencyController);
httpServer.register('get', '/currencies/convert', convertCurrencyController);
httpServer.register('get', '/currencies/{code}', getCurrencyByCodeController);
httpServer.register('delete', '/currencies/{code}', deleteCurrencyController);
httpServer.listen(3000);
