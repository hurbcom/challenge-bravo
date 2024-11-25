import { Currency, CurrencyRepository, CurrencyService as ICurrencyService } from '../types';

export class CurrencyService implements ICurrencyService {
  private currencies: Map<string, Currency>;
  private lastUpdate: number;
  private fiatRepository: CurrencyRepository;
  private cryptoRepository: CurrencyRepository;
  private readonly UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

  constructor(fiatRepository: CurrencyRepository, cryptoRepository: CurrencyRepository) {
    this.currencies = new Map();
    this.lastUpdate = 0;
    this.fiatRepository = fiatRepository;
    this.cryptoRepository = cryptoRepository;

    this.initialize();
  }

  private initialize() {
    const defaultCurrencies: Currency[] = [
      { code: 'USD', name: 'US Dollar', type: 'fiat', rate: 1 },
      { code: 'BRL', name: 'Brazilian Real', type: 'fiat', rate: 0 },
      { code: 'EUR', name: 'Euro', type: 'fiat', rate: 0 },
      { code: 'BTC', name: 'Bitcoin', type: 'crypto', rate: 0 },
      { code: 'ETH', name: 'Ethereum', type: 'crypto', rate: 0 },
      { code: 'GOLD', name: 'D&D Gold Piece', type: 'fictional', rate: 0.25 },
      { code: 'GTAS', name: 'GTA Dollar', type: 'fictional', rate: 0.000056 },
    ];

    defaultCurrencies.forEach((currency) => {
      this.currencies.set(currency.code, { ...currency });
    });
  }

  private async updateRates(): Promise<void> {
    const now = Date.now();
    if (now - this.lastUpdate < this.UPDATE_INTERVAL) {
      return;
    }

    try {
      const fiatRates = await this.fiatRepository.getRates();
      const cryptoRates = await this.cryptoRepository.getRates();

      this.currencies.forEach((currency, code) => {
        if (currency.type === 'fiat') {
          currency.rate = fiatRates.get(code) || currency.rate;
        } else if (currency.type === 'crypto') {
          currency.rate = cryptoRates.get(code) || currency.rate;
        }
      });

      this.lastUpdate = now;
    } catch (error) {
      console.error('Error updating rates:', error);
      throw new Error('Failed to update currency rates');
    }
  }

  async convert(from: string, to: string, amount: number): Promise<number> {
    await this.updateRates();

    const fromCurrency = this.currencies.get(from);
    const toCurrency = this.currencies.get(to);

    if (!fromCurrency || !toCurrency) {
      throw new Error('Currency not found');
    }

    const usdAmount = amount / fromCurrency.rate;
    return usdAmount * toCurrency.rate;
  }

  async addCurrency(currency: Currency): Promise<void> {
    if (this.currencies.has(currency.code)) {
      throw new Error('Currency already exists');
    }
    this.currencies.set(currency.code, { ...currency });
  }

  async removeCurrency(code: string): Promise<void> {
    if (!this.currencies.has(code)) {
      throw new Error('Currency not found');
    }
    if (code === 'USD') {
      throw new Error('Cannot remove base currency (USD)');
    }
    this.currencies.delete(code);
  }

  async getAllCurrencies(): Promise<Currency[]> {
    await this.updateRates();
    return Array.from(this.currencies.values()).map((currency) => ({ ...currency }));
  }
}
