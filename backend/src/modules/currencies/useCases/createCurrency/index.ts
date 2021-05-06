import { CurrenciesRepository } from "../../repositories/implementations/CurrenciesRepository";
import { CreateCurrencyController } from "./CreateCurrencyController";
import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

const currenciesRepository = CurrenciesRepository.getInstance();

const createCurrencyUseCase = new CreateCurrencyUseCase(currenciesRepository);

const createCurrencyController = new CreateCurrencyController(
    createCurrencyUseCase
);

export { createCurrencyController };
