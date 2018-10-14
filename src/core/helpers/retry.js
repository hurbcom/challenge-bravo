const _delay = delay => new Promise(resolve => setTimeout(resolve, delay));

const retry = (requestFn, times, delay) => {
  const promise = requestFn();
  return promise.catch((err) => {
    if (times > 0) {
      return _delay(delay).then(() => retry(requestFn, times - 1, delay));
    }
    throw err;
  });
};


module.exports = retry;
