import { getRepository, Repository } from "typeorm";

import { ICreateCurrencyDTO } from "../../../dtos/ICreateCurrencyDTO";
import { ICurrenciesRepository } from "../../../repositories/ICurrenciesRepositories";
import { Currency } from "../entities/Currency";

class CurrenciesRepository implements ICurrenciesRepository {
  private repository: Repository<Currency>;

  constructor() {
    this.repository = getRepository(Currency);
  }

  async getAll(): Promise<Currency[]> {
    const all = await this.repository.find();

    return all;
  }

  async addCurrency(newCurrencyDTO: ICreateCurrencyDTO): Promise<Currency> {
    const newCurrency = this.repository.create(newCurrencyDTO);

    if (newCurrency.isFictional) {
      Object.assign(newCurrency, { expireAt: null });
    }

    const currencyCreated = await this.repository.save(newCurrency);

    return currencyCreated;
  }

  async getCurrencyByCode(currencyCode: string): Promise<Currency> {
    const currency = await this.repository.findOne({ currencyCode });

    return currency;
  }

  async deleteCurrency(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { CurrenciesRepository };
