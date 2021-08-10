import { container } from "tsyringe";
import { ICache } from "../cache/ICache";
import RedisCache from "../cache/RedisCache";
import { CurrencyRepository } from "../repositories/CurrencyRepository";
import { ICurrencyRepository } from "../repositories/ICurrencyRepository";


container.registerSingleton<ICurrencyRepository>(
    "CurrencyRepository",
     CurrencyRepository
);

container.registerSingleton<ICache>(
    "RedisCache",
     RedisCache
);