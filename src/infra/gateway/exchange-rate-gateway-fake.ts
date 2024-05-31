import ExchangeRateGateway, { CurrencyExchange } from "@/application/gateway/exchange-rate-gateway";

export class ExchangeRateGatewayFake implements ExchangeRateGateway {
  private _rates: { [key: string]: number } = {
    USD: 1,
    BRL: 5.20,
    EUR: 0.92,
  };
  async getExchangeRate(exchangeCode: string): Promise<CurrencyExchange> {
    if (this._rates[exchangeCode]) {
      return {
        code: exchangeCode,
        rate: this._rates[exchangeCode],
      }
    }
    throw new Error('Invalid exchange code');
  }
}