import factory from "factory-girl";
import faker from "faker";
import Currency from "@models/Currency";

factory.define('Currency', Currency, {
  name: faker.finance.currencyName(),
  symbol: faker.finance.currencySymbol()
});

export default factory;