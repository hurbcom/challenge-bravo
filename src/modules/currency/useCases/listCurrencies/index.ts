import { CurrencyRepository } from "../../repositories/implementations/CurrencyRepository";
import { ListCurrencyController } from "./ListCurrencyController";
import { ListCurrencyUseCase } from "./ListCurrencyUseCase";

export default (): ListCurrencyController => {
    const currencyRepository = new CurrencyRepository();
    const listCurrencyUseCase = new ListCurrencyUseCase(currencyRepository);

    const listCurrencyController = new ListCurrencyController(
        listCurrencyUseCase
    );

    return listCurrencyController;
};
