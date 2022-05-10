import { ICurrencyDao } from '../../interfaces/currency-dao';
import { Currency, CurrencyDto } from '../../model/currency';

export class CurrencyDao implements ICurrencyDao {
  public async getAllCurrencies(): Promise<CurrencyDto[]> {
    const currencyList = await Currency.find({});
    return currencyList;
  }

  public async getByCode(currencyCode: string): Promise<CurrencyDto> {
    const currency = await Currency.findOne({ code: currencyCode });
    return currency;
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
