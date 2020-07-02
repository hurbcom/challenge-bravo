import factory, { Static } from "factory-girl";
import faker from "faker";
import Currency, { ICurrency } from "@models/Currency";

factory.define<ICurrency>('Currency', Currency, () => ({
  name: faker.finance.currencyName(),
  symbol: faker.finance.currencySymbol()
}));

export default factory;