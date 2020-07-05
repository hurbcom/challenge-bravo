import CurrencyService from "./contracts/CurrencyService";
import { injectable, inject } from "inversify";
import { ICurrency } from "@models/Currency";
import types from "@core/types";
import CurrencyRepository from "../repositories/CurrencyRepository";

@injectable()
export default class HurbCurrencyService extends CurrencyService {

  constructor(@inject(types.CurrencyRepository) private currencyRepository: CurrencyRepository) {
    super();
  }

  async findById(id: number) {
    return await this.currencyRepository.findById(id);
  }

  async findBySymbol(symbol: string) {
    return await this.currencyRepository.findBySymbol(symbol);
  }

  async index() {
    return await this.currencyRepository.index();
  }

  async create(data: ICurrency) {
    return this.currencyRepository.create(data);
  }

  async update(id: number, data: ICurrency) {
    return await this.currencyRepository.update(id, data);
  }

  async delete(id: number) {
    return await this.currencyRepository.delete(id);
  }
}