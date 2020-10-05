import { BadRequestException, Injectable } from '@nestjs/common';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class ExchangeService {
  constructor(private currenciesService: CurrenciesService) {}

  async convertAmount({ from, to, amount }): Promise<any> {
    if (!from || !to || !amount) {
      throw new BadRequestException();
    }

    try {
      const fromCurrency = await this.currenciesService.getCurrency(from);
      const toCurrency = await this.currenciesService.getCurrency(to);

      return { amount: (fromCurrency.value / toCurrency.value) * amount };
    } catch (error) {
      throw new Error(error);
    }
  }
}
