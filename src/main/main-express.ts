import ConvertCurrency from "@/application/use-case/convert-currency";
import CreateCurrencyRate from "@/application/use-case/create-currency-rate";
import { DeleteCurrencyRateByCode } from "@/application/use-case/delete-currency-rate-by-code";
import GetCurrencyRateByCode from "@/application/use-case/get-currency-rate-by-code";
import { CurrencyController } from "@/infra/http-server/currency.controller";
import { ExpressAdapter } from "@/infra/http-server/express-adapter";
import CurrencyRateRepositoryFake from "@/infra/repository/currency-rate-repository-fake";

const httpServer = new ExpressAdapter();
const currencyRateRepository = new CurrencyRateRepositoryFake();
const currencyConverter = new ConvertCurrency(currencyRateRepository)
const createCurrencyRate = new CreateCurrencyRate(currencyRateRepository)
const getCurrencyRateByCode = new GetCurrencyRateByCode(currencyRateRepository)
const deleteCurrencyRateByCode = new DeleteCurrencyRateByCode(currencyRateRepository)
new CurrencyController(httpServer, currencyConverter, createCurrencyRate, getCurrencyRateByCode, deleteCurrencyRateByCode)
httpServer.listen(3000);