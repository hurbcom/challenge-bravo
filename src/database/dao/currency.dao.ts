import { ICurrencyMapper } from '../../mappers/currency.mapper';
import { Currency, CurrencyDto } from '../../model/currency';

export interface ICurrencyDao {
  getAllCurrencies(): Promise<CurrencyDto[]>;
  getCurrenciesByType(currencyType: string): Promise<CurrencyDto[]>;
  getByCode(currencyCode: string): Promise<CurrencyDto>;
  save(currency: CurrencyDto): Promise<CurrencyDto>;
  update(filter: any, update: any): Promise<any>;
  delete(currencyCode: string): Promise<CurrencyDto>;
}

export class CurrencyDao implements ICurrencyDao {
  public async getAllCurrencies(): Promise<CurrencyDto[]> {
    const currencyList = await Currency.find({}, { code: 1, exchangeRate: 1, type: 1, _id: 0 });
    return currencyList;
  }

  public async getByCode(currencyCode: string): Promise<CurrencyDto> {
    const currency = await Currency.findOne(
      { code: currencyCode },
      { code: 1, exchangeRate: 1, type: 1, _id: 0 },
    );
    return currency;
  }

  public async getCurrenciesByType(currencyType: string): Promise<CurrencyDto[]> {
    const currencyList = await Currency.find(
      { type: currencyType },
      { code: 1, exchangeRate: 1, type: 1, _id: 0 },
    );
    return currencyList;
  }

  public async save(currency: CurrencyDto): Promise<CurrencyDto> {
    const newCurrency = new Currency(currency);
    const currencyAdded = await newCurrency.save();
    return currencyAdded;
  }

  public async update(filter: any, update: any): Promise<any> {
    const updatedCurrency = await Currency.updateOne(filter, { $set: update });
    return updatedCurrency;
  }

  public async delete(currencyCode: string): Promise<CurrencyDto> {
    const deletedCurrency = await Currency.findOneAndDelete({ code: currencyCode });
    return deletedCurrency;
  }
}
