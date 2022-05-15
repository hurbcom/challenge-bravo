import { ICurrencyMapper } from '../../mappers/currency.mapper';
import { Currency, CurrencyDto } from '../../model/currency';

export interface ICurrencyDao {
  getAllCurrencies(): Promise<CurrencyDto[]>;
  getCurrenciesByType(currencyType: string): Promise<CurrencyDto[]>;
  getByCode(currencyCode: string): Promise<CurrencyDto>;
  save(currency: CurrencyDto): Promise<CurrencyDto>;
  update(filter: any, update: any): Promise<void>;
  delete(currencyCode: string): Promise<CurrencyDto>;
}

export class CurrencyDao implements ICurrencyDao {
  private currencyMapper: ICurrencyMapper;

  constructor(currencyMapper: ICurrencyMapper) {
    this.currencyMapper = currencyMapper;
  }

  public async getAllCurrencies(): Promise<CurrencyDto[]> {
    const currencyList = await Currency.find({});
    const currencyDtoList = currencyList.map((currency) => this.currencyMapper.toDto(currency));
    return currencyDtoList;
  }

  public async getByCode(currencyCode: string): Promise<CurrencyDto> {
    const currency = await Currency.findOne({ code: currencyCode });
    const currencyDto = currency ? this.currencyMapper.toDto(currency) : currency;
    return currencyDto;
  }

  public async getCurrenciesByType(currencyType: string): Promise<CurrencyDto[]> {
    const currencyList = await Currency.find({ type: currencyType });
    const currencyDtoList = currencyList.map((currency) => this.currencyMapper.toDto(currency));
    return currencyDtoList;
  }

  public async save(currency: CurrencyDto): Promise<CurrencyDto> {
    const newCurrency = new Currency(currency);
    const currencyAdded = await newCurrency.save();
    const currencyDto = this.currencyMapper.toDto(currencyAdded);
    return currencyDto;
  }

  public async update(filter: any, update: any): Promise<void> {
    await Currency.updateOne(filter, { $set: update });
  }

  public async delete(currencyCode: string): Promise<CurrencyDto> {
    const deletedCurrency = await Currency.findOneAndDelete({ code: currencyCode });
    const currencyDto = this.currencyMapper.toDto(deletedCurrency);
    return currencyDto;
  }
}
