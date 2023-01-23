import { IQuotationsRepository } from "../../repositories/IQuotationsRepository";

interface IRquest {
    code: string;
    name: string;
    high: string;
    low: string;
}

class CreateQuotationUseCase {
    constructor(private quotationRepository: IQuotationsRepository) {}

    async execute({ code, name, high, low }: IRquest): Promise<void> {
        const quotationAlredyExists = await this.quotationRepository.findByCode(
            code
        );

        if (quotationAlredyExists) {
            throw new Error("Coin alredy exists in database!");
        }

        this.quotationRepository.create({ code, name, high, low });
    }
}

export { CreateQuotationUseCase };
