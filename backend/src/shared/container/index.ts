import { container } from "tsyringe";

import { CurrenciesRepository } from "@modules/currencies/infra/typeorm/repositories/CurrenciesRepository";
import { ICurrenciesRepository } from "@modules/currencies/repositories/ICurrenciesRepository";
import { ExchangeRepository } from "@modules/exchanges/infra/typeorm/repositories/ExchangesRepository";
import { IExchangeRepository } from "@modules/exchanges/repositories/IExchangeRepository";

container.registerSingleton<ICurrenciesRepository>(
    "CurrenciesRepository",
    CurrenciesRepository
);

container.registerSingleton<IExchangeRepository>(
    "ExchangeRepository",
    ExchangeRepository
);
