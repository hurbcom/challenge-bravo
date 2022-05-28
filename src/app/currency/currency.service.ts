import { BadRequestException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { CurrencyDbService } from 'src/core/database/currencyDb/currencyDB.service';
import { CurrencyDto } from 'src/core/database/currencyDb/currency.dto';
import { ExchangeHttpService } from 'src/core/exchange-http/exchange-http.service';

@Injectable()
export class CurrencyService {

  constructor(
    private readonly currencyDbService: CurrencyDbService,
    private readonly exchangeHttpService: ExchangeHttpService
  ) { }

  async create(request: CurrencyDto) {
    let response = await this.exchangeHttpService.get(`/latest?base=USD&symbols=${request.currency}`);
    if (_.get(response.data.rates, request.currency) || (request.rate && request.rate != null && request.rate > 0))
      return await this.currencyDbService.upsertCurrency(request)
    else
      throw new BadRequestException('Currency not found, please enter the exchange rate');
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

  async remove(currency: string) {
    return await this.currencyDbService.removeCurrency(currency);
  }
}
