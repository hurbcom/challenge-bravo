process.env = {
  CRYPTOCOMPARE_URL: 'https://min-api.cryptocompare.com/data/price?fsym={{from}}&tsyms={{to}}',
  CRYPTOCOMPARE_RETRY_DELAY: 100,
  CRYPTOCOMPARE_RETRY_TIMES: 1,
  CRYPTOCOMPARE_TIMEOUT: 3000,
  NODE_ENV: 'test',
  PORT: 3000,
};
