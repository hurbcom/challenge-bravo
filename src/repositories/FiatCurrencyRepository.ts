import axios from 'axios';
import { appConfig } from '../config/application';
import { CurrencyRepository } from '../types';

export class FiatCurrencyRepository implements CurrencyRepository {
  private readonly API_URL = `${appConfig.EXCHANGE_RATE_API}/latest/USD`;

  async getRates(): Promise<Map<string, number>> {
    try {
      const response = await axios.get(this.API_URL);
      const rates = response.data.rates;
      return new Map(Object.entries(rates));
    } catch (error) {
      console.error('Error fetching fiat rates:', error);
      throw new Error('Failed to fetch fiat currency rates');
    }
  }

  getType(): string {
    return 'fiat';
  }
}
