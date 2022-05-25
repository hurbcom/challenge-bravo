import { getRepository, Repository } from "typeorm";

import { ICreateCurrencyDTO } from "@modules/currency/dtos/ICreateCurrencyDTO";
import { ICurrenciesRepository } from "@modules/currency/repositories/ICurrenciesRepository";

import { Currency } from "../entities/Currency";

class CurrenciesRepository implements ICurrenciesRepository {
  private repository: Repository<Currency>;

  constructor() {
    this.repository = getRepository(Currency);
  }

  async create({ name }: ICreateCurrencyDTO): Promise<Currency> {
    const currency = this.repository.create({
      name,
    });

    await this.repository.save(currency);

    return currency;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByName(name: string): Promise<Currency> {
    const currency = await this.repository.findOne({ name });

    return currency;
  }
}

export { CurrenciesRepository };
