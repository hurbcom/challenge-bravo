import { CurrencyRepository } from "../../repositories/implementations/CurrencyRepository";
import { ListCurrencyController } from "./ListCurrencyController";
import { ListCurrencyUseCase } from "./ListCurrencyUseCase";

const quotationRepository = null;
const listQuotationUseCase = new ListCurrencyUseCase(quotationRepository);
const listQuotationsController = new ListCurrencyController(
    listQuotationUseCase
);

export { listQuotationsController };
