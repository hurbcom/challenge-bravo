import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  initializeRates,
  convertCurrency,
  addCurrency,
  removeCurrency,
  clearCurrencies,
  getCurrency,
  getAllCurrencies
} from '../../src/services/currencyService';

const mock = new MockAdapter(axios);

describe('currencyService', () => {
  beforeEach(() => {
    clearCurrencies();
  });

  it('should initialize rates correctly', async () => {
    const fiatRates = {
      conversion_rates: {
        USD: 1,
        BRL: 5,
        EUR: 0.85
      }
    };

    const symbolData = [
      { id: 'bitcoin', symbol: 'btc' },
      { id: 'ethereum', symbol: 'eth' }
    ];

    const cryptoRates = {
      bitcoin: { usd: 45000 },
      ethereum: { usd: 3000 }
    };

    mock.onGet(/v6.exchangerate-api.com/).reply(200, fiatRates);
    mock.onGet(/api.coingecko.com\/api\/v3\/coins\/markets/).reply(200, symbolData);
    mock.onGet(/api.coingecko.com\/api\/v3\/simple\/price/).reply(200, cryptoRates);

    await initializeRates();

    const allCurrencies = await getAllCurrencies();
    expect(allCurrencies).toEqual([
      { code: 'USD', type: 'FIAT', unit: '1.00 USD' },
      { code: 'BRL', type: 'FIAT', unit: '5.00 USD' },
      { code: 'EUR', type: 'FIAT', unit: '0.85 USD' },
      { code: 'BTC', type: 'CRYPTO', unit: '45000.00 USD' },
      { code: 'ETH', type: 'CRYPTO', unit: '3000.00 USD' }
    ]);
  });

  it('should convert currency correctly', async () => {
    const fiatRates = {
      conversion_rates: {
        USD: 1,
        BRL: 5
      }
    };

    mock.onGet(/v6.exchangerate-api.com/).reply(200, fiatRates);

    await initializeRates();

    const convertedAmount = await convertCurrency('BRL', 'USD', 10);
    expect(convertedAmount).toBe('2.00');
  });

  it('should add a fictitious currency correctly', async () => {
    await addCurrency('GOLD', 'FICTITIOUS', 1800);
    const currency = await getCurrency('GOLD');
    expect(currency).toEqual({ code: 'GOLD', type: 'FICTITIOUS', unit: '1800.00 USD' });
  });

  it('should remove a currency correctly', async () => {
    await addCurrency('GOLD', 'FICTITIOUS', 1800);
    removeCurrency('GOLD');
    const currency = await getCurrency('GOLD');
    expect(currency).toBeUndefined();
  });

  it('should handle unsupported currency conversion', async () => {
    await expect(convertCurrency('ABC', 'USD', 10)).rejects.toThrow('Unsupported currency');
  });

  it('should handle adding existing currency', async () => {
    await addCurrency('USD', 'FIAT');
    await expect(addCurrency('USD', 'FIAT')).rejects.toThrow('Currency already exists');
  });
});
