
import { injectable, inject } from "inversify";

import types from "@core/types";
import CurrencyService from "./contracts/CurrencyService";
import { ICurrency } from "@models/Currency";
import CurrencyRepository from "../repositories/CurrencyRepository";
import { get, del, setex } from "@utils/cache";

@injectable()
export default class HurbCurrencyService extends CurrencyService {

  constructor(@inject(types.CurrencyRepository) private currencyRepository: CurrencyRepository) {
    super();
  }

  async findById(id: number) {
    const cached = await get(`currencies/${id}`);

    if (cached)
      return JSON.parse(cached);

    const currency = await this.currencyRepository.findById(id);
    await setex(`currencies/${id}`, 3600, JSON.stringify(currency))
    return currency;
  }

  async findBySymbol(symbol: string) {
    const cached = await get('currencies');

    if (cached) {
      const result = JSON.parse(cached).find(c => c.symbol === symbol);

      if (result)
        return result;
    }

    return await this.currencyRepository.findBySymbol(symbol);
  }

  async index() {
    const cached = await get('currencies');

    if (cached)
      return JSON.parse(cached);

    const currencies = await this.currencyRepository.index();

    await setex('currencies', 3600, JSON.stringify(currencies));

    return currencies;
  }

  async create(data: ICurrency) {
    await del('currencies');
    return this.currencyRepository.create(data);
  }

  async delete(id: number) {
    await del('currencies');
    await del(`currencies/${id}`);

    return this.currencyRepository.delete(id);
  }
}