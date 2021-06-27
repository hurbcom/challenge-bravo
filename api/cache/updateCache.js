const redis = require('./configRedis');
const crawler = require('./crawler');

async function updateCache() {
    console.log('Atualizando cache...');
    const exchanges = await crawler();

    const exchangePromises = Object.keys(exchanges).map(coin => redis.set(coin, exchanges[coin], 'EX', 7 * 60));
    await Promise.all(exchangePromises);
    await redis.set('update_time', new Date().toISOString());

    return exchanges;
}

module.exports = updateCache;