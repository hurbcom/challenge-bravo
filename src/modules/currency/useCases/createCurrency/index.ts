import { CurrencyRepository } from "../../repositories/implementations/CurrencyRepository";
import { CreateCurrencyController } from "./CreateCurrencyCrontroller";
import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

export default (): CreateCurrencyController => {
    const quotationsRepository = new CurrencyRepository();
    const createQuotationUseCase = new CreateCurrencyUseCase(
        quotationsRepository
    );

    const createQuotationController = new CreateCurrencyController(
        createQuotationUseCase
    );

    return createQuotationController;
};
