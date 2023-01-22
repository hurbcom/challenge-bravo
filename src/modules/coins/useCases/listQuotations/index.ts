import { QuotationRepository } from "../../repositories/QuotationsRepository";
import { ListQuotationsController } from "./ListQuotationsController";
import { ListQuotationsUseCase } from "./ListQuotationsUseCase";

const quotationRepository = QuotationRepository.getInstance();
const listQuotationUseCase = new ListQuotationsUseCase(quotationRepository);
const listQuotationsController = new ListQuotationsController(
    listQuotationUseCase
);

export { listQuotationsController };
