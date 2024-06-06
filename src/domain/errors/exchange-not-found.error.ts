import NotFoundError from "./not-found.error";

export default class ExchangeRateNotFoundError extends NotFoundError {
  constructor(exchangeRateIdOrCode: string) {
    super(`Exchange rate not found: ${exchangeRateIdOrCode}`);
    this.name = 'ExchangeRateNotFound';
  }
}