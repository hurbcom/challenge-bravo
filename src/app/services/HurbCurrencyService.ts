import CurrencyService from "./contracts/CurrencyService";
import { injectable } from "inversify";
import Currency, { ICurrency } from "@models/Currency";

@injectable()
export default class HurbCurrencyService extends CurrencyService {

  async findById(id: number) {
    return await Currency.findByPk(id);
  }

  async findBySymbol(symbol: string) {
    return await Currency.findOne({ where: { symbol } });
  }

  async index() {
    return await Currency.findAll();
  }

  async create(data: ICurrency) {
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