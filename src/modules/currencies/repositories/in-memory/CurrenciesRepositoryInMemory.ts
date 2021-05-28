import { ICreateCurrencyDTO } from "../../dtos/ICreateCurrencyDTO";
import { Currency } from "../../infra/typeorm/entities/Currency";
import { ICurrenciesRepository } from "../ICurrenciesRepositories";

class CurrenciesRepositoryInMemory implements ICurrenciesRepository {
  currencies: Currency[] = [];

  async getAll(): Promise<Currency[]> {
    return this.currencies;
  }
  async addCurrency({
    currencyCode,
    currencyName,
    priceUsd,
    isFictional,
  }: ICreateCurrencyDTO): Promise<Currency> {
    const currency = new Currency();

    Object.assign(currency, {
      currencyCode,
      currencyName,
      priceUsd,
      isFictional,
    });

    this.currencies.push(currency);

    return currency;
  }
  async getCurrencyByCode(currencyCode: string): Promise<Currency> {
    return this.currencies.find(
      (currency) => currency.currencyCode === currencyCode
    );
  }
  async deleteCurrency(id: string): Promise<void> {
    const index = this.currencies.findIndex((currency) => currency.id === id);
    this.currencies.splice(index, 1);
  }
}

export { CurrenciesRepositoryInMemory };
