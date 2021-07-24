import { ICurrency } from '@interfaces/ICurrency';

import { ICreateCurrencyDTO } from '@repositories/dtos/ICreateCurrencyDTO';
import { IUpdateCurrencyDTO } from '@repositories/dtos/IUpdateCurrencyDTO';
import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

import CurrencyEntity from '../entities/CurrencyEntity';

export class CurrenciesRepository implements ICurrenciesRepository {
  private mongooseRepository: typeof CurrencyEntity;
  private selectFields = {
    _id: 0,
    code: 1,
    backingCurrency: 1,
    createdAt: 1,
    updatedAt: 1,
  };

  constructor() {
    this.mongooseRepository = CurrencyEntity;
  }

  private logger({
    method,
    message,
  }: {
    method: string;
    message?: string;
  }): void {
    console.log(
      'MongoDB (bravodb) |'.blue,
      `CurrenciesRepository (${method})${message ? ` - ${message}` : ''}`,
    );
  }

  public async create({
    code,
    backingCurrency,
  }: ICreateCurrencyDTO): Promise<ICurrency> {
    this.logger({ method: 'create' });

    const currency = await this.mongooseRepository.create({
      code,
      backingCurrency,
    });

    const formattedCurrency: ICurrency = {
      code: currency.code,
      backingCurrency: currency.backingCurrency,
      createdAt: currency.createdAt,
      updatedAt: currency.updatedAt,
    };

    return formattedCurrency;
  }

  public async findAll(): Promise<ICurrency[]> {
    this.logger({ method: 'findAll' });

    const currencies = await this.mongooseRepository
      .find()
      .select(this.selectFields)
      .lean();

    return currencies;
  }

  public async findOne({ code }: { code: string }): Promise<ICurrency | null> {
    this.logger({ method: 'findOne' });

    const currency = await this.mongooseRepository
      .findOne({ code })
      .select(this.selectFields)
      .lean();

    return currency;
  }

  public async updateByCode(
    code: string,
    { backingCurrency }: IUpdateCurrencyDTO,
  ): Promise<ICurrency | null> {
    this.logger({ method: 'updateByCode' });

    const updatedCurrency = await this.mongooseRepository
      .findOneAndUpdate(
        {
          code,
        },
        { backingCurrency },
        { new: true },
      )
      .select(this.selectFields)
      .lean();

    return updatedCurrency;
  }

  public async deleteByCode(code: string): Promise<void> {
    this.logger({ method: 'deleteByCode' });

    await this.mongooseRepository.deleteOne({ code });
  }
}
