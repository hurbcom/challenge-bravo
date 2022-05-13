import { ICoinbaseIntegrationService } from '../interfaces/coinbase-integration-service';
import { ICurrencyDao } from '../interfaces/currency-dao';
import { ICurrencyService } from '../interfaces/currency-service';
import { Currency, CurrencyDto, CurrencyType } from '../model/currency';
import {
  ExchangeRateForRealCurrencyNotAllowed,
  ExchangeRateNotInformedForFictitiousCurrency,
  CurrencyAlreadyRegistered,
  CurrencyNotFound,
} from './responses/currency-service.errors';

export type ExchangeResult = {
  to: string;
  amount: string;
};

export class CurrencyService implements ICurrencyService {
  constructor(
    private readonly currencyDao: ICurrencyDao,
    private readonly coinbaseIntegrationService: ICoinbaseIntegrationService,
  ) {}

  public async addCurrency(currencyDto: CurrencyDto): Promise<CurrencyDto> {
    const { code, exchangeRate } = currencyDto;
    const { data: apiCurrencies } = await this.coinbaseIntegrationService.getCurrencies();

    const isIncluded = apiCurrencies.some((currency) => currency.id === code);

    if (isIncluded && exchangeRate) {
      throw new ExchangeRateForRealCurrencyNotAllowed(code);
    }

    if (!isIncluded && !exchangeRate) {
      throw new ExchangeRateNotInformedForFictitiousCurrency(code);
    }

    const dbCurrency = await this.currencyDao.getByCode(code);

    if (dbCurrency) {
      throw new CurrencyAlreadyRegistered(code);
    }

    if (isIncluded) {
      const { rates } = await this.coinbaseIntegrationService.getExchangeRates();

      const currency = new Currency({ code, exchangeRate: rates[code], type: CurrencyType.REAL });
      const realCurrencyAdded = await this.currencyDao.save(currency);

      return realCurrencyAdded;
    }

    const currency = new Currency({ code, exchangeRate, type: CurrencyType.FICTITIOUS });
    const fictitiousCurrencyAdded = await this.currencyDao.save(currency);

    return fictitiousCurrencyAdded;
  }

  public async deleteCurrency(currencyCode: any): Promise<CurrencyDto> {
    const deletedCurrency = await this.currencyDao.delete(currencyCode);
    if (!deletedCurrency) {
      throw new CurrencyNotFound(currencyCode);
    }

    return deletedCurrency;
  }

  public async exchangeCurrencies(from: string, to: string, amount: string): Promise<any> {
    const fromCurrency = await this.currencyDao.getByCode(from);
    if (!fromCurrency) {
      return new CurrencyNotFound(from);
    }

    const toCurrency = from === to ? fromCurrency : await this.currencyDao.getByCode(to);
    if (!toCurrency) {
      throw new CurrencyNotFound(to);
    }

    const result = this.exchange(fromCurrency, toCurrency, amount);

    return result;
  }

  private exchange(fromCurrency: any, toCurrency: any, amount: string) {
    const amountNumber = parseFloat(amount);
    const baseAmount = amountNumber / fromCurrency.exchangeRate;
    const finalAmount = (baseAmount * toCurrency.exchangeRate).toFixed(2);

    const result: ExchangeResult = { to: toCurrency.code, amount: finalAmount };
    return result;
  }
}
