import "dotenv/config";
import debug from "debug";
import app from "./Routes";
import injectContainer from "./invesity";
import { type CurrencyService } from "./Services/CurrencyService";
import { type CurrencyRedisRepository } from "./Infra/Repository/Redis/CurrencyRedisRepository";

const logger = debug("app:Main");
const port = 3000;

const currencyService = injectContainer.get<CurrencyService>("CurrencyService");
const currencyRepo =
    injectContainer.get<CurrencyRedisRepository>("CurrencyRepository");

async function main() {
    logger("Starting cache");
    await currencyRepo.init();
    await currencyService.getAllCurrenciesDollarRateCache();
    logger("Finish cache");
    app.listen(port, () => {
        logger(`App listening on port ${port}`);
    });
}

main()
    .catch((e) => {
        logger(e);
    })
    .finally(() => {
        logger("Started");
    });
