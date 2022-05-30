import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(limit: number, page: number) {
    const response = await this.currencyDbService.findAllCurrencies(limit, limit * page - limit);
    let currencies = []
    const apiCurrencies = await this.exchangeHttpService.get(`/latest?base=USD`);
    for (const r of response.rows) {
      currencies.push({
        currency: r.currency,
        rate: _.get(apiCurrencies.data.rates, r.currency) ? _.get(apiCurrencies.data.rates, r.currency) : r.rate
      });
    }
    return { currencies: currencies, total: response.count, totalPages: Math.ceil(response.count / limit) }
  }

  async findOne(id: string) {
    const currencyObj = await this.currencyDbService.findCurrency(id);
    if (currencyObj) {
      const response = await this.exchangeHttpService.get(`/latest?base=USD&symbols=${id}`);
      if (_.get(response.data.rates, id)) return {
        currency: currencyObj.currency,
        rate: _.get(response.data.rates, id)
      };
      else
        return {
          currency: currencyObj.currency,
          rate: currencyObj.rate
        };
    }
    else
      throw new NotFoundException(`Currncy ${id} not found.`);
  }

  async remove(currency: string) {
    return await this.currencyDbService.removeCurrency(currency);
  }
}
