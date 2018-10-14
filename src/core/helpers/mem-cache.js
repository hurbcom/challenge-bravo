const NodeCache = require('node-cache');

const myCache = new NodeCache();


const set = (key, value) => {
  myCache.set(key, value);
};

const get = key => myCache.get(key, true);


module.exports = {
  get,
  set,
};
