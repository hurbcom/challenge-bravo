import { CurrenciesRepository } from "../../repositories/implementations/CurrenciesRepository";
import { ImportCurrenciesController } from "./importCurrenciesController";
import { ImportCurrenciesUseCase } from "./importCurrenciesUseCase";

const currenciesRepository = CurrenciesRepository.getInstance();

const importCurrenciesUseCase = new ImportCurrenciesUseCase(
    currenciesRepository
);

const importCurrenciesController = new ImportCurrenciesController(
    importCurrenciesUseCase
);

export { importCurrenciesController };
