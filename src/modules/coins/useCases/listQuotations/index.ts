import { QuotationRepository } from "../../repositories/implementations/QuotationsRepository";
import { ListQuotationsController } from "./ListQuotationsController";
import { ListQuotationsUseCase } from "./ListQuotationsUseCase";

const quotationRepository = null;
const listQuotationUseCase = new ListQuotationsUseCase(quotationRepository);
const listQuotationsController = new ListQuotationsController(
    listQuotationUseCase
);

export { listQuotationsController };
