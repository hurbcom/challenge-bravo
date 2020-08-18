import FakeCurrenciesRepositories from '../../repositories/fakes/FakeCurrenciesRepositories';
import ApiExchangeClient from '../../integrations/ApiExchangeClient';

interface Exchange {
    to: string;

    from: string;

    amount: number;
}

class FakeExchangeCurrenciesService {
  public async execute({ to, from, amount }: Exchange):Promise<number> {
    const fakeCurrenciesRepositories = new FakeCurrenciesRepositories();
    const findToCurrency = await fakeCurrenciesRepositories.findCurrencyByCode(to);
    const findFromCurrency = await fakeCurrenciesRepositories.findCurrencyByCode(from);
    if (!(findToCurrency && findFromCurrency)) {
      throw Error('This currency code does not exist in our list! Please add an available currency code');
    }
    const exchangeApi = new ApiExchangeClient();
    const getCurrenciesValues = await exchangeApi.connectApi();

    const getToCurrencyValue = getCurrenciesValues.rates[to];
    const getFromCurrencyValue = getCurrenciesValues.rates[from];

    const convertedToAmount = (amount / getFromCurrencyValue);
    const currencyConverted = convertedToAmount * getToCurrencyValue;

    return currencyConverted;
  }
}
export default FakeExchangeCurrenciesService;
