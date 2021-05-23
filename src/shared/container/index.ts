import { container } from "tsyringe";

import { CurrenciesRepository } from "../../modules/currencies/infra/typeorm/repositories/CurrenciesRepository";
import { ICurrenciesRepository } from "../../modules/currencies/repositories/ICurrenciesRepositories";

container.registerSingleton<ICurrenciesRepository>(
  "CurrenciesRepository",
  CurrenciesRepository
);
