import { Quotation } from "../../entities/Quotation";
import { IQuotationsRepository } from "../../repositories/IQuotationsRepository";

class ListQuotationsUseCase {
    constructor(private quotationRepository: IQuotationsRepository) {}

    execute(): Quotation[] {
        const quotations = this.quotationRepository.list();

        return quotations;
    }
}

export { ListQuotationsUseCase };
