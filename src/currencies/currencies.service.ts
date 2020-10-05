import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrenciesRepository } from './currencies.repository';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(CurrenciesRepository) private currenciesRepository: CurrenciesRepository,
  ) {}

  async getCurrency(currency: string): Promise<any> {
    return await this.currenciesRepository.getCurrency(currency);
  }
}
