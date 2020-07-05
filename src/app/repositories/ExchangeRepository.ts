
import { injectable } from "inversify";
import axios from "axios";
import { get, setex } from "@utils/cache";
@injectable()
export default class ExchangeRepository {

  async symbols() {
    try {
      const cached = await get('symbols');

      if (cached)
        return JSON.parse(cached);

      const response = await axios.get(`${process.env.COIN_API_BASE_URL}/assets`, { headers: { "X-CoinAPI-Key": process.env.COIN_API_KEY } });
      const symbols = response.data.map((s: any) => ({ symbol: s.asset_id, name: s.name }));
      setex('symbols', 3600, JSON.stringify(symbols));
      return symbols;
    } catch (error) {
      return [];
    }
  }

  async getExchangeRate(from: string, to: string) {
    try {
      const cached = await get(`exchangerate/${from}/${to}`);

      if (cached)
        return JSON.parse(cached);

      const response = await axios.get(`${process.env.COIN_API_BASE_URL}/exchangerate/${from}/${to}`, {
        headers: {
          "X-CoinAPI-Key": process.env.COIN_API_KEY
        }
      });

      const rate = parseFloat(response.data.rate.toFixed(20));
      setex(`exchangerate/${from}/${to}`, 600, JSON.stringify(rate));

      return rate;
    } catch (error) {
      return undefined;
    }
  }

}