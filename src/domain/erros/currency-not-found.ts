export default class CurrencyNotFoundError extends Error {
  constructor(currencyCode: string) {
    super(`Currency not found: ${currencyCode}`);
    this.name = 'CurrencyNotFound';
  }
}