
import { injectable } from "inversify";
import axios from "axios";
import ExchangeService from "@services/contracts/ExchangeService";

@injectable()
export default class CoinAPIService extends ExchangeService {

  async getSymbols() {
    try {
      const response = await axios.get(`${process.env.COIN_API_BASE_URL}/assets`);
      return response.data?.map((a: any) => a.asset_id) || [];
    } catch (error) {
      return [];
    }
  }
}