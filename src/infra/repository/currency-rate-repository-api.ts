import { CurrencyRateRepository } from '@/application/repository/';
import { CurrencyRate } from '@/domain/entity/';
import { CurrencyNotFoundError } from '@/domain/errors/';
import { CurrencyApiGateway } from '@/infra/gateway';

export class CurrencyRateRepositoryApi implements CurrencyRateRepository {
  currencyMap: Map<string, CurrencyRate>;

  constructor(private readonly currencyGateway: CurrencyApiGateway) {
    this.currencyMap = new Map();
  }

  async findByCode(code: string): Promise<CurrencyRate> {
    if (this.currencyMap.has(code)) {
      return this.currencyMap.get(code)!;
    }
    const currencyResponse = await this.currencyGateway.getCurrencies({
      currencies: [code],
    });
    const currencyData = currencyResponse.data[code];
    if (!currencyResponse.data[code] || !currencyResponse.data[code]) {
      throw new CurrencyNotFoundError(code);
    }
    const rateResponse = await this.currencyGateway.getRates({
      currencies: [code],
    });
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

export default CurrencyRateRepositoryApi;
