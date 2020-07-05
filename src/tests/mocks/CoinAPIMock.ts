import nock from "nock";

import symbols from "./data/symbols";

export const MockGetSymbolsRequest = () => {
  return nock(`${process.env.COIN_API_BASE_URL}`)
    .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
    .get('/assets')
    .reply(200, symbols);
}