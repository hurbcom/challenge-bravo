const fetch = require('node-fetch');
const {
  env, memCache, retry, urlParser,
} = require('../../helpers');


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

const saveInMemoryTheCoinsRates = (res, from) => {
  Object.keys(res).forEach((coin) => {
    const key = `${from}-${coin}`;
    const value = res[coin];
    memCache.set(key, value);
  });
  return res;
};

const verifyAndRemoveExceededCoins = (res, to) => {
  const newRes = {};
  to.forEach((coin) => {
    newRes[coin] = res[coin];
  });
  return newRes;
};

const request = ({ from = '', to = [] }) => {
  const {
    CRYPTOCOMPARE_URL: url,
    CRYPTOCOMPARE_RETRY_DELAY: delay,
    CRYPTOCOMPARE_RETRY_TIMES: times,
    CRYPTOCOMPARE_TIMEOUT: timeout,
  } = env;
  const urlParsed = urlParser({ url, from, to });
  const requestOptions = { method: 'GET', timeout: Number(timeout) };
  const requestFn = () => fetch(urlParsed, requestOptions);
  return retry(requestFn, times, delay)
    .then(res => res.json())
    .then(res => verifyAndRemoveExceededCoins(res, to))
    .then(res => saveInMemoryTheCoinsRates(res, from))
    .catch(err => readFromMemoryTheCoinsRates(err, from, to));
};


module.exports = request;
