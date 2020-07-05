export default class ExchangeRateError extends Error {
  constructor(args: any) {
    super(args);
    this.name = "ExchangeRateError"
  }
}