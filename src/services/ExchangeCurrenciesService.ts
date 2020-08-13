import { getCustomRepository } from 'typeorm';

import CurrenciesRepositories from '../repositories/CurrenciesRepositories';
import ApiExchangeClient from '../integrations/ApiExchangeClient';

interface Exchange {
    to: string;

    from: string;

    amount: number;
}

class ExchangeCurrenciesService {
  public async execute({ to, from, amount }: Exchange) {
    const currenciesRepositories = getCustomRepository(CurrenciesRepositories);
    const findToCurrency = await currenciesRepositories.findCurrencyByCode(to);
    const findFromCurrency = await currenciesRepositories.findCurrencyByCode(from);
    if (!(findToCurrency && findFromCurrency)) {
      throw Error('This currency code does not exist in our list! Please add an available currency code');
    }
    const exchangeApi = new ApiExchangeClient();
    const getCurrenciesValues = await exchangeApi.connectApi();
    const getbaseCurrencyValue = getCurrenciesValues.rates.USD;
    const getToCurrencyValue = getCurrenciesValues.rates[to];
    const getFromCurrencyValue = getCurrenciesValues.rates[from];

    const convertedToAmount = (amount / getFromCurrencyValue);
    const currencyConverted = convertedToAmount * getToCurrencyValue;
    return currencyConverted;
  }
}
export default ExchangeCurrenciesService;
