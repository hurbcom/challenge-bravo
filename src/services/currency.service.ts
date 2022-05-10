import { ICurrencyDao } from '../interfaces/currency-dao';
import { Currency } from '../model/currency';
import { CoinbaseIntegrationService } from './coinbase-integration.service';
import {
  FictitiousCurrencyAlreadyRegistered,
  InvalidFictitiousCurrencyCode,
  CurrencyAdded,
  RealCurrencyAlreadyRegistered,
  RealCurrencyNotSupported,
  CurrencyDeleted,
  CurrencyNotFound,
  CurrencyExchanged,
} from './responses/currency-service.response';

export type ExchangeResult = {
  to: string;
  amount: string;
};

export class CurrencyService {
  constructor(
    private readonly currencyDao: ICurrencyDao,
    private readonly coinbaseIntegrationService: CoinbaseIntegrationService,
  ) {}

  public async addRealCurrency(currencyCode: any) {
    const { data: apiCurrencies } = await this.coinbaseIntegrationService.getCurrencies();

    const isIncluded = apiCurrencies.some((currency) => currency.id === currencyCode);
    if (!isIncluded) {
      return new RealCurrencyNotSupported(currencyCode);
    }

    const dbCurrency = await this.currencyDao.getByCode(currencyCode);
    if (dbCurrency) {
      return new RealCurrencyAlreadyRegistered(currencyCode);
    }

    const { rates } = await this.coinbaseIntegrationService.getExchangeRates();

    const currency = new Currency({ code: currencyCode, rate: rates[currencyCode] });
    const currencyAdded = await this.currencyDao.save(currency);

    return new CurrencyAdded(currencyAdded);
  }

  public async addFictitiousCurrency(currencyInput: any) {
    const { data: apiCurrencies } = await this.coinbaseIntegrationService.getCurrencies();

    const isIncluded = apiCurrencies.some((currency) => currency.id === currencyInput.currency);
    if (isIncluded) {
      return new InvalidFictitiousCurrencyCode(currencyInput.currency);
    }

    const dbCurrency = await this.currencyDao.getByCode(currencyInput.currency);
    if (dbCurrency) {
      return new FictitiousCurrencyAlreadyRegistered(currencyInput.currency);
    }

    const currency = new Currency({
      code: currencyInput.currency,
      rate: currencyInput.exchangeRate,
    });
    const fictitiousCurrencyAdded = await this.currencyDao.save(currency);

    return new CurrencyAdded(fictitiousCurrencyAdded);
  }

  public async deleteCurrency(currencyCode: any) {
    const deletedCurrency = await this.currencyDao.delete(currencyCode);
    if (!deletedCurrency) {
      return new CurrencyNotFound(currencyCode);
    }

    return new CurrencyDeleted(deletedCurrency);
  }

  public async exchangeCurrencies(from: string, to: string, amount: string) {
    const fromCurrency = await this.currencyDao.getByCode(from);
    if (!fromCurrency) {
      return new CurrencyNotFound(from);
    }

    const toCurrency = from === to ? fromCurrency : await this.currencyDao.getByCode(to);
    if (!toCurrency) {
      return new CurrencyNotFound(to);
    }

    const result = this.exchange(fromCurrency, toCurrency, amount);

    return new CurrencyExchanged(result);
  }

  private exchange(fromCurrency: any, toCurrency: any, amount: string) {
    const amountNumber = parseFloat(amount);
    const baseAmount = amountNumber / fromCurrency.rate;
    const finalAmount = (baseAmount * toCurrency.rate).toFixed(2);

    const result: ExchangeResult = { to: toCurrency.code, amount: finalAmount };
    return result;
  }
}
