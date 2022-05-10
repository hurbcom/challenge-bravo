import { ServiceResponse } from './service.response';

export class RealCurrencyNotSupported extends ServiceResponse {
  constructor(currencyCode: string) {
    super(
      null,
      'RealCurrencyNotSupported',
      `The currency ${currencyCode} is not supported by the Coinbase.`,
    );
  }
}

export class RealCurrencyAlreadyRegistered extends ServiceResponse {
  constructor(currencyCode: string) {
    super(
      null,
      'RealCurrencyAlreadyRegistered',
      `The currency ${currencyCode} is already registered in the database.`,
    );
  }
}

export class RealCurrencyAdded extends ServiceResponse {
  constructor(currency: any) {
    super(
      currency,
      'RealCurrencyAdded',
      `The currency ${currency.code} was registered in the database.`,
    );
  }
}
