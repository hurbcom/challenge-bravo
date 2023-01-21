import { Quotation } from "../model/Quotation";

interface ICreateQuotationDTO {
    code: string;
    name: string;
    high: string;
    low: string;
}

class QuotationRepository {
    private quotations: Quotation[];

    constructor() {
        this.quotations = [];
    }

    create({ code, name, high, low }: ICreateQuotationDTO): void {
        const quotation = new Quotation();

        Object.assign(quotation, {
            code,
            name,
            high,
            low,
            type: "FICTITIOUS",
            created_at: new Date(),
            updated_at: new Date(),
        });

        this.quotations.push(quotation);
    }

    list(): Quotation[] {
        return this.quotations;
    }
}

export { QuotationRepository };
