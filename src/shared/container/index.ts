import { container } from "tsyringe";

import { CurrenciesRepository } from "../../modules/currencies/infra/typeorm/repositories/CurrenciesRepository";
import { ICurrenciesRepository } from "../../modules/currencies/repositories/ICurrenciesRepositories";
import { exchangeApiService } from "../infra/services/ExchangeApiService";
import { RedisService } from "../infra/services/RedisService";
import { ICacheService } from "../services/ICacheService";
import { IExchangeApiService } from "../services/IExchangeApiService";

container.registerSingleton<ICurrenciesRepository>(
  "CurrenciesRepository",
  CurrenciesRepository
);

container.registerSingleton<ICacheService>("CacheService", RedisService);

container.registerSingleton<IExchangeApiService>(
  "ExchangeApiService",
  exchangeApiService
);
