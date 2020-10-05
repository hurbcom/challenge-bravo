import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(CurrenciesRepository) private currenciesRepository: CurrenciesRepository,
  ) {}

  async getCurrency(currency: string): Promise<Currencies> {
    return await this.currenciesRepository.getCurrency(currency);
  }

  async createCurrency(currency: Currencies): Promise<Currencies> {
    return await this.currenciesRepository.createCurrency(currency);
  }
}
