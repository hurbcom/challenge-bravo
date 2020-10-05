import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';
import { CreateCurrencyDto } from './dto/create.currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(CurrenciesRepository) private currenciesRepository: CurrenciesRepository,
  ) {}

  async getCurrency(currency: string): Promise<Currencies> {
    return await this.currenciesRepository.getCurrency(currency);
  }

  async createCurrency({ currency, value }: CreateCurrencyDto): Promise<Currencies> {
    const createCurrency = new Currencies();
    createCurrency.currency = currency;
    createCurrency.value = value;

    const errors = await validate(createCurrency);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.currenciesRepository.createCurrency(createCurrency);
  }
}
