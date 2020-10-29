import { Redis } from 'ioredis';
import redisClient, { RedisClient, SUPPORTED_CURRENCIES_KEY } from '../../config/redis';

class CurrencyCache {
    private redisClient: RedisClient;

    constructor() {
        this.redisClient = redisClient;
    }

    public async getSupportedCurrencies() : Promise<string[]> {
        try{
            return await this.getClient().smembers(SUPPORTED_CURRENCIES_KEY);
        } catch (err) {
            console.error(`An error occurred while trying to obtain the supported currencies. [${err}].`);
            throw err;
        }
    }

    private getClient() : Redis {
        return this.redisClient.getClient();
    }
}

export default CurrencyCache;