import { QuotationRepository } from "../../repositories/QuotationsRepository";
import { CreateQuotationController } from "./CreateQuotationCrontroller";
import { CreateQuotationUseCase } from "./CreateQuotationUseCase";

const QuotationsRepository = QuotationRepository.getInstance();
const createQuotationUseCase = new CreateQuotationUseCase(QuotationsRepository);

const createQuotationController = new CreateQuotationController(
    createQuotationUseCase
);

export { createQuotationController };
