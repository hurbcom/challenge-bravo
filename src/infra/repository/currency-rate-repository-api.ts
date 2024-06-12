import CurrencyRateRepository from "@/application/repository/currency-rate-repository";
import CurrencyRate from "@/domain/currency-rate";
import CurrencyRateNotFoundError from "@/domain/errors/currency-rate-not-found.error";
import CurrencyApiGateway from "../gateway/currency-api-gateway";

export class CurrencyRateRepositoryApi implements CurrencyRateRepository {
  currencyMap: Map<string, CurrencyRate>;

  constructor(private readonly currencyGateway: CurrencyApiGateway) {
    this.currencyMap = new Map();
  }

  async findByCode(code: string): Promise<CurrencyRate> {
    if (this.currencyMap.has(code)) {
      return this.currencyMap.get(code)!;
    }
    const currencyResponse = await this.currencyGateway.getCurrencies({ currencies: [code] });
    const currencyData = currencyResponse.data[code];
    if (!currencyResponse.data[code] || !currencyResponse.data[code]) {
      throw new CurrencyRateNotFoundError(code);
    }
    const rateResponse = await this.currencyGateway.getRates({ currencies: [code] });
    const rateData = rateResponse.data[code];
    const currency = new CurrencyRate(
      currencyData.code,
      currencyData.name,
      currencyData.code,
      currencyData.symbol,
      currencyData.decimal_digits,
      rateData.value
    );
    return currency;
  }

  async add(currencyRate: CurrencyRate): Promise<void> {
    if (this.currencyMap.has(currencyRate.code)) {
      throw new Error('Currency already exists');
    }
    this.currencyMap.set(currencyRate.code, currencyRate);
  }

  async delete(code: string): Promise<void> {
    if (!this.currencyMap.has(code)) {
      throw new Error('Currency not found');
    }
    this.currencyMap.delete(code);
  }

}