import { CurrencyDao } from '../database/dao/currency.dao';
import Currency from '../model/currency';
import { CoinbaseIntegrationService } from './coinbase-integration.service';
import {
  FictitiousCurrencyAlreadyRegistered,
  InvalidFictitiousCurrencyCode,
  CurrencyAdded,
  RealCurrencyAlreadyRegistered,
  RealCurrencyNotSupported,
} from './responses/currency-service.response';

export class CurrencyService {
  constructor(
    private readonly currencyDao: CurrencyDao,
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
}
