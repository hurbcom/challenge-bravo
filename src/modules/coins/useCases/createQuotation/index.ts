import { QuotationRepository } from "../../repositories/implementations/QuotationsRepository";
import { CreateQuotationController } from "./CreateQuotationCrontroller";
import { CreateQuotationUseCase } from "./CreateQuotationUseCase";

export default (): CreateQuotationController => {
    const quotationsRepository = new QuotationRepository();
    const createQuotationUseCase = new CreateQuotationUseCase(
        quotationsRepository
    );

    const createQuotationController = new CreateQuotationController(
        createQuotationUseCase
    );

    return createQuotationController;
};
