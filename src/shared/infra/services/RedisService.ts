import redis, { RedisClient } from "redis";
import { inject, injectable } from "tsyringe";

import { ICacheService } from "../../services/ICacheService";
import { IExchangeApiService } from "../../services/IExchangeApiService";

@injectable()
class RedisService implements ICacheService {
  private readonly client: RedisClient;

  constructor(
    @inject("ExchangeApiService")
    private exchangeApiService: IExchangeApiService
  ) {
    this.client = redis.createClient();
  }

  async saveAllCurrenciesNames(names: { name: string }[]): Promise<void> {
    const serializeCurrencies = JSON.stringify(names);
    this.client.set("currencies", serializeCurrencies);
    console.log("salvei todos os nomes!!!!");
  }
  async getCurrencyNameByCode(currencyCode: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get("currencies", async (err, res) => {
        if (err) reject(err);

        if (res) {
          const currencies = JSON.parse(res);

          const currencyName = this.extractCurrencyName(
            currencyCode,
            currencies
          );

          return resolve(currencyName);
        }

        const { currencies } =
          await this.exchangeApiService.getAllCurrenciesNames();

        await this.saveAllCurrenciesNames(currencies);

        const currencyName = this.extractCurrencyName(currencyCode, currencies);

        return resolve(currencyName);
      });
    });
  }

  private extractCurrencyName(currencyCode, currencies: any) {
    const [_, currencyName] = Object.entries(currencies).find(
      ([k, v]) => k === currencyCode
    );

    return currencyName as string;
  }
}

export { RedisService };
