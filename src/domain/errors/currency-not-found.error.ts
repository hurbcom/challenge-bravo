import NotFoundError from './not-found.error';

export class CurrencyNotFoundError extends NotFoundError {
  constructor(currencyRateIdOrCode: string) {
    super(`Currency not found: ${currencyRateIdOrCode}`);
    this.name = 'CurrencyNotFoundError';
  }
}

export default CurrencyNotFoundError;
