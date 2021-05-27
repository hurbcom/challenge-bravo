import { Currency } from "./src/modules/currencies/infra/typeorm/entities/Currency";
import { getTodayDate } from "./src/shared/utils/dateOperation";

export const defaultCurrencies: Currency[] = [
  {
    currencyCode: "USD",
    currencyName: "US Dollar",
    priceUsd: 1,
    isFictional: false,
    expireAt: null,
  },
  {
    currencyCode: "BRL",
    currencyName: "Brazilian Real",
    priceUsd: 0,
    isFictional: false,
    expireAt: getTodayDate(),
  },
  {
    currencyCode: "EUR",
    currencyName: "Euro",
    priceUsd: 0,
    isFictional: false,
    expireAt: getTodayDate(),
  },
  {
    currencyCode: "BTC",
    currencyName: "Bitcoin",
    priceUsd: 0,
    isFictional: false,
    expireAt: getTodayDate(),
  },
  {
    currencyCode: "ETH",
    currencyName: "Ethereum",
    priceUsd: 0,
    isFictional: false,
    expireAt: getTodayDate(),
  },
];
