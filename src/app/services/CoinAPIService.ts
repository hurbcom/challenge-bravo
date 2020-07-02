
import { injectable } from "inversify";
import axios from "axios";
import ExchangeService from "@services/contracts/ExchangeService";

@injectable()
export default class CoinAPIService extends ExchangeService {

  async symbols() {
    try {
      const response = await axios.get(`${process.env.COIN_API_BASE_URL}/assets`, { headers: { "X-CoinAPI-Key": "7306FB98-3D52-4CA2-9D6B-9A26034A9E40" } });
      return response.data.map((s: any) => ({ symbol: s.asset_id, name: s.name }));
    } catch (error) {
      return [];
    }
  }
}