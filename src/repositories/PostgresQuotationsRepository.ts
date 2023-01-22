import { Quotation } from "../model/Quotation";
import {
    IQuotationsRepository,
    ICreateQuotationDTO,
} from "./IQuotationsRepository";

class PostgresQuotationsRepository implements IQuotationsRepository {
    findByCode(code: string): Quotation {
        console.log(code);
        return null;
    }
    list(): Quotation[] {
        return null;
    }
    create({ code, name, high, low }: ICreateQuotationDTO): void {
        console.log(code, name, high, low);
    }
}

export { PostgresQuotationsRepository };
