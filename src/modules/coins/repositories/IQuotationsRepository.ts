import { Quotation } from "../entities/Quotation";

interface ICreateQuotationDTO {
    code: string;
    name: string;
    high: string;
    low: string;
}

interface IQuotationsRepository {
    findByCode(code: string): Quotation;
    list(): Quotation[];
    create({ code, name, high, low }: ICreateQuotationDTO): void;
}

export { IQuotationsRepository, ICreateQuotationDTO };
