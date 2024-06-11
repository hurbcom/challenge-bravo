import ConvertCurrency from "@/application/use-case/convert-currency";
import CreateCurrencyRate from "@/application/use-case/create-currency-rate";
import { DeleteCurrencyRateByCode } from "@/application/use-case/delete-currency-rate-by-code";
import GetCurrencyRateByCode from "@/application/use-case/get-currency-rate-by-code";
import { PgPromiseAdapter } from "@/infra/database/pgpromise-adapter";
import { CurrencyController } from "@/infra/http-server/currency.controller";
import { ExpressAdapter } from "@/infra/http-server/express-adapter";
import { CurrencyRateRepositoryDatabase } from "@/infra/repository/currency-rate-repository-database";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const currencyRateRepository = new CurrencyRateRepositoryDatabase(connection);
const currencyConverter = new ConvertCurrency(currencyRateRepository)
const createCurrencyRate = new CreateCurrencyRate(currencyRateRepository)
const getCurrencyRateByCode = new GetCurrencyRateByCode(currencyRateRepository)
const deleteCurrencyRateByCode = new DeleteCurrencyRateByCode(currencyRateRepository)
new CurrencyController(httpServer, currencyConverter, createCurrencyRate, getCurrencyRateByCode, deleteCurrencyRateByCode)
httpServer.listen(3000);