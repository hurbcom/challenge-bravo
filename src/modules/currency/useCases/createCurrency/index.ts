import { CurrencyRepository } from "../../repositories/implementations/CurrencyRepository";
import { CreateCurrencyController } from "./CreateCurrencyCrontroller";
import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

export default (): CreateCurrencyController => {
    const currencyRepository = new CurrencyRepository();
    const createCurrencyUseCase = new CreateCurrencyUseCase(currencyRepository);

    const createCurrencyController = new CreateCurrencyController(
        createCurrencyUseCase
    );

    return createCurrencyController;
};
