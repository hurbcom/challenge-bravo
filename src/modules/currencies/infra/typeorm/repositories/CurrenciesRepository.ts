import { getRepository, Repository } from "typeorm";

import { ICreateCurrencyDTO } from "../../../dtos/ICreateCurrencyDTO";
import { ICurrenciesRepository } from "../../../repositories/ICurrenciesRepositories";
import { Currency } from "../entities/Currency";

class CurrenciesRepository implements ICurrenciesRepository {
  private repository: Repository<Currency>;

  constructor() {
    this.repository = getRepository(Currency);
  }

  async addCurrency(newCurrencyDTO: ICreateCurrencyDTO): Promise<Currency> {
    const newCurrency = this.repository.create(newCurrencyDTO);

    const currencyCreated = await this.repository.save(newCurrency);

    return currencyCreated;
  }

  async getCurrencyByCode(currencyCode: string): Promise<Currency> {
    const currency = await this.repository.findOne({ currencyCode });

    return currency;
  }
}

export { CurrenciesRepository };
