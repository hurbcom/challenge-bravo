import { CreateCurrencyDTO } from '../dto/create-currency.dto';
import { Currency } from '../entities/currency.entity';
import { CurrencyRepository } from '../repositories/currency.repository';
import { CurrencyCacheManager } from './currency-cache-manager.service';
import { ExternalCurrencyAPI } from './external-currency-api.service';

export class CurrencyService {
  constructor(
    private readonly currencyRepository: CurrencyRepository,
    private readonly externalCurrencyAPI: ExternalCurrencyAPI,
    private readonly cacheManager: CurrencyCacheManager,
  ) {}
  
  async createCurrency(createCurrencyDTO: CreateCurrencyDTO): Promise<Currency> {
    const exists = await this.currencyRepository.findByCurrencyCode(createCurrencyDTO.code);
    if(exists) {
      throw new Error('Currency already exists');
    }
    const currency = new Currency(
      createCurrencyDTO.code,
      createCurrencyDTO.unitCost,
      createCurrencyDTO.backingCurrency
    );
    await this.currencyRepository.create(currency);
    return currency;
  }
  
  private async getCurrency(currencyCode: string): Promise<Currency | null> {
    const cached = await this.cacheManager.getCache(currencyCode);
    if(cached) return cached;
    const currency = await this.currencyRepository.findByCurrencyCode(currencyCode);
    if(currency) await this.cacheManager.setCache(currency.code, currency);
    return currency;
  }

  private async getExternalCurrency(currencyCode: string): Promise<Currency | null> {
    const currencyValue = await this.externalCurrencyAPI.convert(currencyCode, process.env.DEFAULT_BACKING_CURRENCY || 'USD');
    const currency = new Currency(currencyCode, currencyValue);
    await this.cacheManager.setCache(currency.code, currency);
    return currency;
  }

  async convertCurrency(fromCode: string, toCode: string, amount: string): Promise<string> {
    if(fromCode === toCode) return amount;
    const fromCurrency = await this.getCurrency(fromCode);
    const toCurrency = await this.getCurrency(toCode);
    if(fromCurrency && toCurrency) {
      return fromCurrency.convert(toCurrency, amount);
    }
    if(!fromCurrency && toCurrency){
      const currency = await this.getExternalCurrency(fromCode);
      if(!currency) throw Error('Not found');
      return currency.convert(toCurrency, amount);
    } 
    if(!toCurrency && fromCurrency) {
      const currency = await this.getExternalCurrency(toCode);
      if(!currency) throw Error('Not found');
      return currency.convert(fromCurrency, amount);
    }
    const newFromCurrency = await this.getExternalCurrency(fromCode);
    const newToCurrency = await this.getExternalCurrency(toCode);
    if(!newFromCurrency || !newToCurrency) throw Error('Not found');
    return newFromCurrency.convert(newToCurrency, amount);
  }

  async deleteCurrency(code: string): Promise<void> {
    return this.currencyRepository.deleteByCurrencyCode(code);
  }
}


