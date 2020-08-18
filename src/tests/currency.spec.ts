import { uuid } from 'uuidv4';
import FakeAddCurrencyService from '../services/fakes/FakeAddCurrenciesService';
import FakeDeleteCurrencyService from '../services/fakes/FakeDeleteCurrenciesService';
import FakeExchangeCurrencyService from '../services/fakes/FakeExchangeCurrenciesService';
import FakeCurrenciesRepositories from '../repositories/fakes/FakeCurrenciesRepositories';

describe('Create currency', () => {
  it('should be able to add new currency coins', async () => {
    const fakeCurrenciesRepository = new FakeCurrenciesRepositories();
    const addCurrency = new FakeAddCurrencyService();
    const currency = await fakeCurrenciesRepository.create({
      id: uuid(),
      code: 'BRL',
      name: 'Brazilian Real',
    });
    addCurrency.execute(currency);

    expect(currency).toHaveProperty('id');
    expect(currency.code).toBe('BRL');
    expect(currency.name).toBe('Brazilian Real');
  });

  it('should not be able to add new currency coin that already exists in the database', async () => {
    const fakeCurrenciesRepository = new FakeCurrenciesRepositories();
    const addCurrency = new FakeAddCurrencyService();
    const currency = await fakeCurrenciesRepository.create({
      id: uuid(),
      code: 'USD',
      name: 'United States Dolar',
    });
    addCurrency.execute(currency);

    expect(fakeCurrenciesRepository.create({
      id: uuid(),
      code: 'USD',
      name: 'United States Dolar',
    })).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to add a currency with more than 3 digits', async () => {
    const fakeCurrenciesRepository = new FakeCurrenciesRepositories();
    expect(fakeCurrenciesRepository.create({
      id: uuid(),
      code: 'USDDDD',
      name: 'United States Dolar',
    })).rejects.toBeInstanceOf(Error);
  });
});

describe('Delete currency coin', () => {
  it('should be able to delete a currency coin', async () => {
    const fakeCurrenciesRepository = new FakeCurrenciesRepositories();
    const addCurrency = new FakeAddCurrencyService();
    const deleteCurrency = new FakeDeleteCurrencyService();
    const id = uuid();
    const currency = await fakeCurrenciesRepository.create({
      id,
      code: 'BRL',
      name: 'Brazilian Real',
    });
    addCurrency.execute(currency);
    deleteCurrency.execute(id);
    expect(fakeCurrenciesRepository.findCodeById(id)).rejects.toBeInstanceOf(Error);
  });
});

describe('Exchage currencies coins', () => {
  it('should be able to exchange currencies', async () => {
    const fakeCurrenciesRepository = new FakeCurrenciesRepositories();
    const exchangeCurrency = new FakeExchangeCurrencyService();

    await fakeCurrenciesRepository.create({
      id: uuid(),
      code: 'BRL',
      name: 'Brazilian Real',
    });
    await fakeCurrenciesRepository.create({
      id: uuid(),
      code: 'USD',
      name: 'United States Dolar',
    });
    const convertedAmount = exchangeCurrency.execute({ from: 'USD', to: 'BRL', amount: 1000 });

    expect(convertedAmount).toBeTruthy();
  });
});
