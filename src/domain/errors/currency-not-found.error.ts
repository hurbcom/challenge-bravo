import NotFoundError from "./not-found.error";

export default class CurrencyNotFoundError extends NotFoundError {
  constructor(currencyCode: string) {
    super(`Currency not found: ${currencyCode}`);
    this.name = 'CurrencyNotFound';
  }
}