import { ExternalCurrencyAPI } from '../../domain/currency/services/external-currency-api.service';

export class AwesomeCurrencyAPI implements ExternalCurrencyAPI {
  convert(from: string, to: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
    
}