import 'reflect-metadata';
import { container } from 'tsyringe';
import { CurrencyEntity } from '../../../entities/currency.entity';
import { CurrencyRepository } from '../../../repository/currency.repository';
import { CreateCurrencyRequestDTO } from '../dtos/create-currency.dto';

export class CreateCurrencyService {
  public async execute(data: CreateCurrencyRequestDTO): Promise<CurrencyEntity> {
    const currencyRepository = container.resolve(CurrencyRepository)
    const newCurrency = await currencyRepository.create({ ...data })
    if(!newCurrency) throw new Error ('Was not possible to create this currency')
    return newCurrency
  }
}
