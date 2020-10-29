import redis, { SUPPORTED_VALUES_KEY } from '../config/redis';
import initialCurrencies from '../config/initialCurrencies.json';

export const setInitialSupportedCurrencies: () => Promise<number> = () => {
    return redis.getClient().sadd(SUPPORTED_VALUES_KEY, ...initialCurrencies);
};
