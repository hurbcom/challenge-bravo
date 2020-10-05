import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Currencies } from './currencies.entity';

@EntityRepository(Currencies)
export class CurrenciesRepository extends Repository<Currencies> {
  async getCurrency(currency: string): Promise<any> {
    const result = await this.findOne({ currency });

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }

  async createCurrency(createCurrency: Currencies): Promise<any> {
    if (createCurrency.value <= 0) {
      throw new BadRequestException('Currency value must be greater than 0.');
    }

    try {
      await this.save(createCurrency);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
