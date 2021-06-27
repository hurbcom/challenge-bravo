const updateCache = require('./updateCache');

updateCache();

setInterval(() => updateCache(), 5 * 60 * 1000);
