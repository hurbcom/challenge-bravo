import Currency from '../../model/currency';

export class CurrencyDao {
  public async getAllCurrencies() {
    const currencyList = await Currency.find({});
    return currencyList;
  }

  public async getByCode(currencyCode: string) {
    const currency = await Currency.findOne({ code: currencyCode });
    return currency;
  }

  public async save(currency: any) {
    const newCurrency = new Currency(currency);
    const currencyAdded = await newCurrency.save();
    return currencyAdded;
  }

  public async update(filter: any, update: any) {
    const updatedCurrency = await Currency.updateOne(filter, { $set: update });
    return updatedCurrency;
  }

  public async delete(currencyCode: string) {
    const deletedCurrency = await Currency.findOneAndDelete({ code: currencyCode });
    return deletedCurrency;
  }
}
