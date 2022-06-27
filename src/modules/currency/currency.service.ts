import { CurrencyExchange } from "@/domain/entity";
import { CURRENCY_REPOSITORY, CurrencyRepository } from "@/domain/repository";
import { Inject, Injectable } from "@nestjs/common";
import { CreateCurrencyDto, UpdateCurrencyDto } from "./currency.dto";

@Injectable()
export class CurrencyService {
    constructor(
        @Inject(CURRENCY_REPOSITORY) private readonly repo: CurrencyRepository
    ) {}

    async findAll(): Promise<CurrencyExchange[]> {
        return this.repo.findAll();
    }

    async getByCode(code: string): Promise<CurrencyExchange> {
        return this.repo.getByCode(code);
    }

    async create(currency: CreateCurrencyDto): Promise<CurrencyExchange> {
        return this.repo.create(currency);
    }

    async update({
        code,
        value,
    }: UpdateCurrencyDto): Promise<CurrencyExchange> {
        return this.repo.update(code, value);
    }

    async remove(code: string): Promise<void> {
        return this.repo.remove(code);
    }
}
