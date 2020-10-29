import redis, { SUPPORTED_VALUES_KEY } from '../config/redis';
import initialCurrencies from '../config/initialCurrencies.json';

/** This method verifies if there are supported currencies, and, if not, initializes it with {@var initialCurrencies}. */
export const initializeSupportedCurrencies: () => Promise<string[]> = async () => {
    const redisClient = redis.getClient();

    const currencies = await redisClient.smembers(SUPPORTED_VALUES_KEY);

    if(currencies.length === 0) {
        await redisClient.sadd(SUPPORTED_VALUES_KEY, ...initialCurrencies);
        return initialCurrencies;
    }

    return currencies;
};
