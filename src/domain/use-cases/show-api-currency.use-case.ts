import currencyService from '../../services/currency-services'

export default class ShowApiCurrencyUseCase {
  async execute(): Promise<any> {
    const currency: any = await currencyService.getTopTenCurrency();

    return currency;
  }
}