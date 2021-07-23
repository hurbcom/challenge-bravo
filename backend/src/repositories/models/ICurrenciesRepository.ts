import { ICurrency } from '@interfaces/ICurrency';

import { ICreateCurrencyDTO } from '../dtos/ICreateCurrencyDTO';
import { IUpdateCurrencyDTO } from '../dtos/IUpdateCurrencyDTO';

export interface ICurrenciesRepository {
  create({ code, backingCurrency }: ICreateCurrencyDTO): Promise<ICurrency>;

  findAll(): Promise<ICurrency[]>;

  findOne({ code }: { code: string }): Promise<ICurrency | null>;

  updateByCode(
    code: string,
    { backingCurrency }: IUpdateCurrencyDTO,
  ): Promise<ICurrency | null>;

  deleteByCode(code: string): Promise<void>;
}
