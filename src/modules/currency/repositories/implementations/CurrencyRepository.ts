import { getRepository, Repository } from "typeorm";

import { Currency } from "../../entities/Currency";
import {
    ICurrencyRepository,
    ICreateCurrencyDTO,
} from "../ICurrencyRepository";

class CurrencyRepository implements ICurrencyRepository {
    private repository: Repository<Currency>;

    constructor() {
        this.repository = getRepository(Currency);
    }

    async create({ code, name, high, low }: ICreateCurrencyDTO): Promise<void> {
        const currency = this.repository.create({
            code,
            name,
            high,
            low,
            type: "TESTE",
        });
        await this.repository.save(currency);
    }

    async list(): Promise<Currency[]> {
        const currency = await this.repository.find();
        return currency;
    }

    async findByCode(code: string): Promise<Currency> {
        const currency = await this.repository.findOne({ code });
        return currency;
    }
}

export { CurrencyRepository };
