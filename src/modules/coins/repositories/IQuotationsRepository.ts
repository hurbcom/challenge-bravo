import { Quotation } from "../entities/Quotation";

interface ICreateQuotationDTO {
    code: string;
    name: string;
    high: string;
    low: string;
}

interface IQuotationsRepository {
    findByCode(code: string): Promise<Quotation>;
    list(): Promise<Quotation[]>;
    create({ code, name, high, low }: ICreateQuotationDTO): Promise<void>;
}

export { IQuotationsRepository, ICreateQuotationDTO };
