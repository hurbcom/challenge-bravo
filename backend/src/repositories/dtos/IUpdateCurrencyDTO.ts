import { OriginalCurrencyCode } from '@utils/originalCurrencyCodes';

type BackingCurrency = {
  code: OriginalCurrencyCode;
  amount: number;
};

export interface IUpdateCurrencyDTO {
  backingCurrency: BackingCurrency;
}
