import axios from 'axios';
import Big from 'big.js';
import { ExternalCurrencyAPI } from '../../domain/currency/services/external-currency-api.service';

export class AwesomeCurrencyAPI implements ExternalCurrencyAPI {
  private readonly _baseUrl = 'https://economia.awesomeapi.com.br/'; 
  async convert(from: string, to: string, amount: string): Promise<string> {
    if(from === to) return amount;
    const response = await axios.get(`${this._baseUrl}/last/${from}-${to}`);
    const body = response.data;
    return new Big(body[`${from}${to}`].bid)
      .times(amount)
      .round(2)
      .valueOf();
  }
    
}