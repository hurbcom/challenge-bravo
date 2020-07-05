
import { injectable } from "inversify";
import axios from "axios";

@injectable()
export default class ExchangeRepository {

  async symbols() {
    try {
      //TODO: implement cache for this operation
      const response = await axios.get(`${process.env.COIN_API_BASE_URL}/assets`, { headers: { "X-CoinAPI-Key": process.env.COIN_API_KEY } });
      return response.data.map((s: any) => ({ symbol: s.asset_id, name: s.name }));
    } catch (error) {
      return [];
    }
  }

  async getExchangeRate(from: string, to: string) {
    //TODO: implement cache in this operation
    try {
      const response = await axios.get(`${process.env.COIN_API_BASE_URL}/exchangerate/${from}/${to}`, {
        headers: {
          "X-CoinAPI-Key": process.env.COIN_API_KEY
        }
      });

      return parseFloat(response.data.rate.toFixed(20));
    } catch (error) {
      return undefined;
    }
  }

}