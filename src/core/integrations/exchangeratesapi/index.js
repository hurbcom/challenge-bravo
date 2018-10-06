const fetch = require('node-fetch');
const { env, retry, urlParser } = require('../../helpers');


const request = ({ from = '', to = [] }) => {
  const {
    EXCHANGERATESAPI_URL: url,
    EXCHANGERATESAPI_RETRY_DELAY: delay,
    EXCHANGERATESAPI_RETRY_TIMES: times,
    EXCHANGERATESAPI_TIMEOUT: timeout,
  } = env;
  const urlParsed = urlParser({ url, from, to });
  const requestOptions = { method: 'GET', timeout };
  const requestFn = () => fetch(urlParsed, requestOptions);
  return retry(requestFn, times, delay).then(res => res.json());
};


module.exports = request;
