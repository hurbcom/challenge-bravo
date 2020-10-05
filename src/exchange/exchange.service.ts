import { BadRequestException, Injectable } from '@nestjs/common';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class ExchangeService {
  constructor(private currenciesService: CurrenciesService) {}

  async convertAmount({ from, to, amount }): Promise<any> {
    if (!from || !to || !amount) {
      throw new BadRequestException();
    }
    this.currenciesService.getCurrency(from);
    this.currenciesService.getCurrency(to);
  }
}
