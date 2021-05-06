import { CurrenciesRepository } from "../../repositories/implementations/CurrenciesRepository";
import { ListCurrenciesController } from "./ListCurrenciesController";
import { ListCurrenciesUseCase } from "./ListCurrenciesUseCase";

const currenciesRepository = CurrenciesRepository.getInstance();

const listCurrenciesUseCase = new ListCurrenciesUseCase(currenciesRepository);

const listCurrenciesController = new ListCurrenciesController(
    listCurrenciesUseCase
);

export { listCurrenciesController };
