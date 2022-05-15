import { CurrencyDto } from '../model/currency';

export interface ICurrencyMapper {
  toDto(currencyObj): CurrencyDto;
}

export class CurrencyMapper implements ICurrencyMapper {
  public toDto(currencyObj): CurrencyDto {
    const currencyDto: CurrencyDto = {
      code: currencyObj.code,
      exchangeRate: currencyObj.exchangeRate,
      type: currencyObj.type,
    };
    return currencyDto;
  }
}
