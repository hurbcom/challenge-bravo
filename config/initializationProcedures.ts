import redis, { SUPPORTED_VALUES_KEY } from '../config/redis';
import initialCurrencies from '../config/initialCurrencies.json';

export const setInitialSupportedCurrencies: () => void = async () => {
    await redis.getClient().sadd(SUPPORTED_VALUES_KEY, ...initialCurrencies).then(result => {
        console.info(`${result} currencies were added on initializing.`);
    }).catch(err => {
        console.log(`Error while trying to set the initial currencies. Error: ${err}.`);
    });
};
