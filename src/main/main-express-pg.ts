import {
  ConvertCurrency,
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from "@/application/use-case/";
import { PgPromiseAdapter } from "@/infra/database/";
import { CurrencyController, ExpressAdapter } from "@/infra/http-server/";
import { CurrencyRateRepositoryDatabase } from "@/infra/repository/";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const currencyRateRepository = new CurrencyRateRepositoryDatabase(connection);
const currencyConverter = new ConvertCurrency(currencyRateRepository)
const createCurrencyRate = new CreateCurrencyRate(currencyRateRepository)
const getCurrencyRateByCode = new GetCurrencyRateByCode(currencyRateRepository)
const deleteCurrencyRateByCode = new DeleteCurrencyRateByCode(currencyRateRepository)
new CurrencyController(httpServer, currencyConverter, createCurrencyRate, getCurrencyRateByCode, deleteCurrencyRateByCode)
httpServer.listen(3000);