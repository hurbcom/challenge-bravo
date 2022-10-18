import axios from 'axios';
import { ExternalCurrencyAPI } from '../../domain/currency/services/external-currency-api.service';

export class AwesomeCurrencyAPI implements ExternalCurrencyAPI {
  private readonly _baseUrl = 'https://economia.awesomeapi.com.br/'; 
  async convert(from: string, to: string): Promise<string> {
    if(from === to) return '1';
    const response = await axios.get(`${this._baseUrl}/last/${from}-${to}`);
    const body = response.data;
    return body[`${from}${to}`].bid;
  }
    
}