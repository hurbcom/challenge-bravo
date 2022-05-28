import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { UpdateExchangeDto } from './dto/update-exchange.dto';
import { ExchangeHttpService } from '../../core/exchange-http/exchange-http.service';
import * as _ from 'lodash';
import { CurrencyDbService } from 'src/core/database/currencyDb/currencyDB.service';

@Injectable()
export class ExchangeService {

  constructor(
    private readonly exchangeHttpService: ExchangeHttpService,
    private readonly currencyDbService: CurrencyDbService,
  ) { }

  create(createExchangeDto: CreateExchangeDto) {
    return 'This action adds a new exchange';
  }

  findAll() {
    return `This action returns all exchange`;
  }

  async convert(from: string, to: string, amount: number) {
    const toCurrencyRate = await this.getRate(to);
    const fromCurrencyRate = await this.getRate(from);
    return {
      from: from,
      to: to,
      amount: parseFloat(((toCurrencyRate / fromCurrencyRate) * amount).toFixed(3))
    }
  }

  update(id: number, updateExchangeDto: UpdateExchangeDto) {
    return `This action updates a #${id} exchange`;
  }

  remove(id: number) {
    return `This action removes a #${id} exchange`;
  }

  async getRate(currency: string): Promise<number> {
    let response = await this.exchangeHttpService.get(`/latest?base=USD&symbols=${currency}`);
    if (_.get(response.data.rates, currency))
      return _.get(response.data.rates, currency)
    else {
      const currencyObj = await this.currencyDbService.findCurrency(currency)

      if (currencyObj) return currencyObj.rate
      else throw new NotFoundException(`Currncy ${currency} not found.`);
    }
  }
}
