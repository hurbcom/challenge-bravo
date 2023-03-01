import "dotenv/config";
import debug from "debug";
import app from "./Routes";
import injectContainer from "./invesity";
import { type CurrencyService } from "./Services/CurrencyService";

const logger = debug("app:Main");
const port = 3000;

const currencyService = injectContainer.get<CurrencyService>("CurrencyService");

async function main() {
    logger("Geeting cache");
    await currencyService.getAllCurrenciesDollarRateCache();
    logger("Finish cache");
    app.listen(port, () => {
        logger(`App listening on port ${port}`);
    });
}

main().finally(() => {
    logger("Started");
});
