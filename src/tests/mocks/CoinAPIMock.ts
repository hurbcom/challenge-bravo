import nock from "nock";

export const MockGetSymbolsRequest = () => {
  return nock(`${process.env.COIN_API_BASE_URL}`)
    .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
    .get('/assets')
    .reply(200, [
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
    ]);
}