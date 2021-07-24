import { OriginalCurrencyCode } from '@utils/originalCurrencyCodes';

export interface ICurrency {
  code: string;
  backingCurrency: {
    code: OriginalCurrencyCode;
    amount: number;
  };

  createdAt?: Date;
  updatedAt?: Date;
}
