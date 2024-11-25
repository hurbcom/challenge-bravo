import axios from 'axios';
import { appConfig } from '../config/application';
import { CurrencyRepository } from '../types';

export class CryptoCurrencyRepository implements CurrencyRepository {
  private readonly API_URL = `${appConfig.COIN_GECKO_API}/simple/price`;

  async getRates(): Promise<Map<string, number>> {
    try {
      const response = await axios.get(this.API_URL, {
        params: {
          ids: 'bitcoin,ethereum',
          vs_currencies: 'usd',
        },
      });

      const rates = new Map<string, number>();
      rates.set('BTC', 1 / response.data.bitcoin.usd);
      rates.set('ETH', 1 / response.data.ethereum.usd);
      return rates;
    } catch (error) {
      console.error('Error fetching crypto rates:', error);
      throw new Error('Failed to fetch cryptocurrency rates');
    }
  }

  getType(): string {
    return 'crypto';
  }
}
