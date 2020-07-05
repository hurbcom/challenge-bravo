import CurrencyService from "./contracts/CurrencyService";
import { injectable, inject } from "inversify";
import Currency, { ICurrency } from "@models/Currency";
import types from "@core/types";
import ExchangeService from "./contracts/ExchangeService";
import UnsupportedSymbolError from "../utils/errors/UnsuportedSymbolError";

@injectable()
export default class HurbCurrencyService extends CurrencyService {

  constructor(@inject(types.ExchangeService) private exchangeService: ExchangeService) {
    super();
  }

  async findById(id: number) {
    return await Currency.findByPk(id);
  }

  async index() {
    return await Currency.findAll();
  }

  async create(data: ICurrency) {
    const symbols = await this.exchangeService.symbols();

    if (!symbols.some(s => s.symbol === data.symbol))
      throw new UnsupportedSymbolError("This currency symbol is not supported by the application");

    return await Currency.create(data);
  }

  async update(id: number, data: ICurrency) {
    return await Currency.update(data, { where: { id } });
  }

  async delete(id: number) {
    const affected = await Currency.destroy({ where: { id } });
    return (affected && affected > 0) ? true : false;
  }
}