import { getRatesFromApi as getRates } from './external/exchangeRateApi';
import Redis from '../databases/redis';

export default class ConversionService { 
    
    constructor(exchangeRatesApi, redisInstance) {
        this._getRates = exchangeRatesApi || getRates;
        this._redis = redisInstance || Redis.instance;
    }

    async calculateExchangeRate({ from, to, amount, reference }) {
        const cacheKey = `external-${from}-${to}`;
        
        const cached = await this._redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const conversion = await this._getRates({ from, to, reference });
        await this._redis.set(cacheKey, JSON.stringify(conversion), 'EX', 20);

        const rate = (conversion[to] / conversion[from]);
        
        return {
            [from]: amount,
            [to]: amount * rate,
            [reference]: (1 / conversion[from]) * amount
        };
    }
}