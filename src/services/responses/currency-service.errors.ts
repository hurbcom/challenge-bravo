import { HttpStatus } from '../../web/http-status';
import { ServiceResponse } from './service.response';

export class ExchangeRateForRealCurrencyNotAllowed extends Error {
  private readonly status: HttpStatus;
  constructor(currencyCode: string) {
    super(
      `The currency ${currencyCode} is listed as a real currency and you cannot set the exchange rate.`,
    );
    this.status = HttpStatus.BAD_REQUEST;
  }
}

export class ExchangeRateNotInformedForFictitiousCurrency extends Error {
  private readonly status: HttpStatus;
  constructor(currencyCode: string) {
    super(`The fictitious currency ${currencyCode} must have an exchange rate.`);
    this.status = HttpStatus.BAD_REQUEST;
  }
}

export class CurrencyAlreadyRegistered extends Error {
  private readonly status: HttpStatus;
  constructor(currencyCode: string) {
    super(`The currency ${currencyCode} is already registered in the database.`);
    this.status = HttpStatus.BAD_REQUEST;
  }
}

export class CurrencyNotFound extends Error {
  private readonly status: HttpStatus;
  constructor(currencyCode: string) {
    super(`The currency ${currencyCode} was not found in the database.`);
    this.status = HttpStatus.BAD_REQUEST;
  }
}
