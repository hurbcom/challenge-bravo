const fetch = require('node-fetch');
const {
  env, memCache, retry, urlParser,
} = require('../../helpers');


const saveInMemoryTheCoinsRates = (res, from) => {
  Object.keys(res).forEach((coin) => {
    const key = `${from}-${coin}`;
    const value = res[coin];
    memCache.set(key, value);
  });
  return res;
};

const readFromMemoryTheCoinsRates = (err, from, to) => {
  const memoryResponse = {};
  try {
    to.forEach((coin) => {
      const key = `${from}-${coin}`;
      memoryResponse[coin] = memCache.get(key);
    });
  } catch (_) {
    throw err;
  }
  return memoryResponse;
};

const request = ({ from = '', to = [] }) => {
  const {
    CRYPTOCOMPARE_URL: url,
    CRYPTOCOMPARE_RETRY_DELAY: delay,
    CRYPTOCOMPARE_RETRY_TIMES: times,
    CRYPTOCOMPARE_TIMEOUT: timeout,
  } = env;
  const urlParsed = urlParser({ url, from, to });
  const requestOptions = { method: 'GET', timeout };
  const requestFn = () => fetch(urlParsed, requestOptions);
  return retry(requestFn, times, delay)
    .then(res => res.json())
    .then(res => saveInMemoryTheCoinsRates(res, from))
    .catch(err => readFromMemoryTheCoinsRates(err, from, to));
};


module.exports = request;
