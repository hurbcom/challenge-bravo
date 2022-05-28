import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { CurrencyDbService } from 'src/core/database/currencyDb/currencyDB.service';
import { CurrencyDto } from 'src/core/database/currencyDb/currency.dto';

@Injectable()
export class CurrencyService {

  constructor(
    private readonly currencyDbService: CurrencyDbService
  ) { }

  async create(request: CurrencyDto) {
    await this.currencyDbService.upsertCurrency(request)
    return 'This action adds a new currency';
  }

  findAll() {
    return `This action returns all currency`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} currency`;
  }

  update(id: number, updateExchangeDto: any) {
    return `This action updates a #${id} currency`;
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
