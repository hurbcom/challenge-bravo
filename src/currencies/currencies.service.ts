import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrenciesService {
  async getCurrency(currency): Promise<any> {
      return currency;
  }
}
