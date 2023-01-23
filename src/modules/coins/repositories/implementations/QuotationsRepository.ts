import { getRepository, Repository } from "typeorm";

import { Quotation } from "../../entities/Quotation";
import {
    IQuotationsRepository,
    ICreateQuotationDTO,
} from "../IQuotationsRepository";

class QuotationRepository implements IQuotationsRepository {
    private repository: Repository<Quotation>;

    constructor() {
        this.repository = getRepository(Quotation);
    }

    async create({
        code,
        name,
        high,
        low,
    }: ICreateQuotationDTO): Promise<void> {
        const quotation = this.repository.create({
            code,
            name,
            high,
            low,
            type: "TESTE",
        });
        await this.repository.save(quotation);
    }

    async list(): Promise<Quotation[]> {
        const quotation = await this.repository.find();

        return quotation;
    }

    async findByCode(code: string): Promise<Quotation> {
        const quotation = await this.repository.findOne({ code });
        return quotation;
    }
}

export { QuotationRepository };
