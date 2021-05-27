/* eslint-disable prettier/prettier */
import { v4 as uuid } from "uuid";

import { Currency } from "../../../../modules/currencies/infra/typeorm/entities/Currency";
import { getTodayDate } from "../../../utils/dateOperation";
import createConnection from "../index";


const defaultCurrencies: Currency[] = [
  {
    currencyCode: "USD",
    currencyName: "US Dollar",
    priceUsd: 1,
    isFictional: false,
    expireAt: getTodayDate(),
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

async function create() {
  const connection = await createConnection("localhost");

  await connection.runMigrations();

  let queryInsert =
    `
    INSERT INTO CURRENCIES (id, currency_code, currency_name, price_usd, "isFictional", expire_at)
    VALUES `;

  defaultCurrencies.forEach((currency, index) => {
    const id = uuid();
    queryInsert +=
      index !== defaultCurrencies.length - 1
        ? `
          ('${id}', '${currency.currencyCode}', '${currency.currencyName}', ${currency.priceUsd}, ${currency.isFictional}, '${currency.expireAt.toISOString()}'), `
        : `
          ('${id}', '${currency.currencyCode}', '${currency.currencyName}', ${currency.priceUsd}, ${currency.isFictional}, '${currency.expireAt.toISOString()}') `;
  });

  const queryUpdate = `
    UPDATE CURRENCIES
    SET
    expire_at = null
    WHERE
    currency_code = 'USD'
  `

  await connection.query(queryInsert);
  await connection.query(queryUpdate);

  await connection.close();
}

create().then(() => console.log("default currencies created!"));
