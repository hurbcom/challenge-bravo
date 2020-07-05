import nock from "nock";

import symbols from "./data/symbols";
import exchangeRateFromUSDToBTC from "./data/exchangeRateFromUSDToBTC";

export const MockGetSymbolsRequest = () => {
  return nock(`${process.env.COIN_API_BASE_URL}`)
    .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
    .get('/assets')
    .reply(200, symbols);
}

export const MockGetExchangeRateFromUSDToBTC = () => {
  return nock(`${process.env.COIN_API_BASE_URL}`)
    .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
    .get('/exchangerate/USD/BTC')
    .reply(200, exchangeRateFromUSDToBTC);
}