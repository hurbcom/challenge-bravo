import Currency from '../../model/currency';

export class CurrencyDao {
  public async getAllCurrencies() {
    const currencyList = await Currency.find({});
    return currencyList;
  }

  public async save(currency: any) {
    const newCurrency = new Currency(currency);
    await newCurrency.save();
  }
}
