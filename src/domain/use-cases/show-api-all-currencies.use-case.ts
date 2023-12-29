import currencyService from '../../services/currency-services'
import { CurrencyApi } from '../entities/dto/currency-api-response.dto';
import { CurrencyResponse } from '../entities/dto/currency-response.dto';

export default class ShowApiAllCurrenciesUseCase {
  async execute(code: string): Promise<CurrencyResponse> {
    const currency: CurrencyApi = await currencyService.getCurrencyHistory(code);

    return currency;
  }
}