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

export class CurrencyAdded extends ServiceResponse {
  constructor(currency: any) {
    super(
      currency,
      'CurrencyAdded',
      `The currency ${currency.code} was registered in the database.`,
    );
  }
}

export class InvalidFictitiousCurrencyCode extends ServiceResponse {
  constructor(currencyCode: string) {
    super(
      null,
      'InvalidFictitiousCurrencyCode',
      `The currency ${currencyCode} is not a fictitious currency. It is already registered in the Coinbase.`,
    );
  }
}

export class FictitiousCurrencyAlreadyRegistered extends ServiceResponse {
  constructor(currencyCode: string) {
    super(
      null,
      'FictitiousCurrencyAlreadyRegistered',
      `The currency ${currencyCode} is already registered in the database.`,
    );
  }
}

export class CurrencyDeleted extends ServiceResponse {
  constructor(currency: any) {
    super(
      currency,
      'CurrencyDeleted',
      `The currency ${currency.code} was deleted from the database.`,
    );
  }
}

export class CurrencyNotFound extends ServiceResponse {
  constructor(currencyCode: string) {
    super(null, 'CurrencyNotFound', `The currency ${currencyCode} was not found in the database.`);
  }
}

export class CurrencyExchanged extends ServiceResponse {
  constructor(exchangeResult: any) {
    super(exchangeResult, 'CurrencyExchanged', `The currencies were exchanged successfully.`);
  }
}
