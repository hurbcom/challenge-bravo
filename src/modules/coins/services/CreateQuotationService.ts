import { IQuotationsRepository } from "../repositories/IQuotationsRepository";

interface IRquest {
    code: string;
    name: string;
    high: string;
    low: string;
}

class CrateQuotationService {
    constructor(private quotationRepository: IQuotationsRepository) {}

    execute({ code, name, high, low }: IRquest): void {
        const quotationAlredyExists = this.quotationRepository.findByCode(code);

        if (quotationAlredyExists) {
            throw new Error("Coin alredy exists in database!");
        }

        this.quotationRepository.create({ code, name, high, low });
    }
}

export { CrateQuotationService };
