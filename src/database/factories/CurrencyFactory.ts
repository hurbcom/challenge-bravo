import factory from "factory-girl";
import Currency, { ICurrency } from "@models/Currency";
import { getRandomUniqueCurrency } from "@database/faker/currency";

factory.define<ICurrency>('Currency', Currency, (): ICurrency => {
  const currency = getRandomUniqueCurrency();
  return { name: currency?.name, symbol: currency.asset_id };
});

export default factory;