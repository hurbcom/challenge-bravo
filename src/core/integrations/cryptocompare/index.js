const fetch = require('node-fetch');
const { env, retry, urlParser } = require('../../helpers');


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
  return retry(requestFn, times, delay).then(res => res.json());
};


module.exports = request;
