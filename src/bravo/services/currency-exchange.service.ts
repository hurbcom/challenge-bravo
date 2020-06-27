import { Injectable, HttpService } from '@nestjs/common';
import { KitLogger } from '../../logger/services';
import { Currency } from '../models';
import { RateReader } from '../readers';

@Injectable()
export class CurrencyExchangeService {
  constructor(
    private httpService: HttpService,
    private logger: KitLogger
  ) {
    this.logger.setContext('CurrencyExchangeService');
  }

  public async exchange(from: Currency, to: Currency, amount: number): Promise<number> {
    this.logger.log(`Request: ${from.name}$ ${amount} -> ${to.name}`);

    const rates: any = await this.httpService.get(`https://api.exchangeratesapi.io/latest?symbols=${to.name}&base=${from.name}`).toPromise();
    const rate: number = RateReader.read(rates, to.name);

    return amount * rate;
  }
}
