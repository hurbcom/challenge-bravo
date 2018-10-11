const nock = require('nock');


const mock = () => {
  const { CRYPTOCOMPARE_URL } = process.env;
  return nock(CRYPTOCOMPARE_URL)
    .get(() => true)
    .reply(200, {
      USD: 1,
      BRL: 3.84,
      EUR: 0.8588,
      BTC: 0.0001598,
      ETH: 0.005023,
    });
};


module.exports = mock;
