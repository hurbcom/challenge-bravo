export default interface ExchangeRateGateway {
  getExchangeRate(exchangeCode: string): Promise<CurrencyExchange>;
}

export type CurrencyExchange = {
  code: string;
  rate: number;
}