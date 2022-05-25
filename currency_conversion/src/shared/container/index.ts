import { container } from "tsyringe";

import { CurrenciesRepository } from "@modules/currency/infra/typeorm/repositories/CurrenciesRepository";
import { ICurrenciesRepository } from "@modules/currency/repositories/ICurrenciesRepository";

container.registerSingleton<ICurrenciesRepository>("CurrenciesRepository", CurrenciesRepository);
