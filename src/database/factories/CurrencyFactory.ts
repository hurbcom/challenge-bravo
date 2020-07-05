import factory from "factory-girl";
import Currency, { ICurrency } from "@models/Currency";

const currencies = [
  {
    "asset_id": "BTC",
    "name": "Bitcoin",
  },
  {
    "asset_id": "USD",
    "name": "US Dollar"
  },
  {
    "asset_id": "EUR",
    "name": "Euro"
  },
  {
    "asset_id": "PLN",
    "name": "Zloty"
  },
  {
    "asset_id": "CNY",
    "name": "Yuan Renminbi"
  },
  {
    "asset_id": "CNY",
    "name": "Yuan Renminbi"
  },
  {
    "asset_id": "BRL",
    "name": "Brazilian Real"
  }
];

const getRandomCurrency = () => {
  return currencies[Math.floor(Math.random() * currencies.length)];
}

factory.define<ICurrency>('Currency', Currency, () => {
  const { name, asset_id: symbol } = getRandomCurrency();
  return { name, symbol };
});

export default factory;