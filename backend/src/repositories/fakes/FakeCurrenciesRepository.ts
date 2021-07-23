import { ICurrency } from '@interfaces/ICurrency';

import { ICreateCurrencyDTO } from '@repositories/dtos/ICreateCurrencyDTO';
import { IUpdateCurrencyDTO } from '@repositories/dtos/IUpdateCurrencyDTO';
import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

export class FakeCurrenciesRepository implements ICurrenciesRepository {
  private currencies: ICurrency[];

  constructor() {
    this.currencies = [];
  }

  public async create({
    code,
    backingCurrency,
  }: ICreateCurrencyDTO): Promise<ICurrency> {
    const currency: ICurrency = {
      code,
      backingCurrency,
    };

    this.currencies.push(currency);

    return currency;
  }

  public async findAll(): Promise<ICurrency[]> {
    return this.currencies;
  }

  public async findOne({ code }: { code: string }): Promise<ICurrency | null> {
    const foundCurrency = this.currencies.find(
      currency => currency.code === code,
    );

    return foundCurrency || null;
  }

  public async updateByCode(
    code: string,
    { backingCurrency }: IUpdateCurrencyDTO,
  ): Promise<ICurrency | null> {
    const currencyIndex = this.currencies.findIndex(
      currency => currency.code === code,
    );

    if (currencyIndex === -1) {
      return null;
    }

    this.currencies[currencyIndex] = {
      ...this.currencies[currencyIndex],
      ...(backingCurrency ? { backingCurrency } : {}),
    };

    return this.currencies[currencyIndex];
  }

  public async deleteByCode(code: string): Promise<void> {
    this.currencies = this.currencies.filter(
      currency => currency.code !== code,
    );
  }
}
