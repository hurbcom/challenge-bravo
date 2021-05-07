import { container } from "tsyringe";

import { ICurrenciesRepository } from "../../modules/currencies/repositories/ICurrenciesRepository"
import { CurrenciesRepository } from "../../modules/currencies/repositories/implementations/CurrenciesRepository"

container.registerSingleton<ICurrenciesRepository>(
    "CurrenciesRepository",
    CurrenciesRepository
);
