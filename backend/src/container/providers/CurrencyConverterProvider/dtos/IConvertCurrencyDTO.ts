type CurrencyCode = 'usd' | 'brl' | 'eur' | 'btc' | 'eth';

export interface IConvertCurrencyDTO {
  from: CurrencyCode;
  to: CurrencyCode;
  amount: number;
}
