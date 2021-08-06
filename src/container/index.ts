import { container } from "tsyringe";
import { CurrencyRepository } from "../repositories/CurrencyRepository";
import { ICurrencyRepository } from "../repositories/ICurrencyRepository";


container.registerSingleton<ICurrencyRepository>(
    "CurrencyRepository",
     CurrencyRepository
);