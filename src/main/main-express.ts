import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from "@/application/use-case/";
import { CurrencyController, ExpressAdapter } from "@/infra/http-server/";
import { CurrencyRateRepositoryFake } from "@/infra/repository/";

const httpServer = new ExpressAdapter();
const currencyRateRepository = new CurrencyRateRepositoryFake();
const currencyConverter = new ConvertCurrency(currencyRateRepository)
const createCurrencyRate = new CreateCurrencyRate(currencyRateRepository)
const getCurrencyRateByCode = new GetCurrencyRateByCode(currencyRateRepository)
const deleteCurrencyRateByCode = new DeleteCurrencyRateByCode(currencyRateRepository)
new CurrencyController(httpServer, currencyConverter, createCurrencyRate, getCurrencyRateByCode, deleteCurrencyRateByCode)
httpServer.listen(3000);