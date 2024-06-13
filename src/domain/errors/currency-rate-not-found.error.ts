import NotFoundError from './not-found.error';

export class CurrencyRateNotFoundError extends NotFoundError {
  constructor(currencyRateIdOrCode: string) {
    super(`Currency rate not found: ${currencyRateIdOrCode}`);
    this.name = 'CurrencyRateNotFoundError';
  }
}

export default CurrencyRateNotFoundError;
