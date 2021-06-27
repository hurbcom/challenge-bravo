const redis = require('./configRedis');
const crawler = require('./crawler');

async function updateCache() {
    const exchanges = await crawler();

    const exchangePromises = Object.keys(exchanges).map(coin => redis.set(coin, exchanges[coin], 'EX', 10 * 60));
    await Promise.all(exchangePromises);
    await redis.set('update_time', new Date().toISOString());
}

updateCache();
