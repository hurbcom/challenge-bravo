import { getRatesFromApi } from './external/exchangeRateApi';
import { promisify } from 'util';
import { client } from '../databases/redis';

const redis = {
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client)
}

export default ({ getRates, cache } = { getRates: getRatesFromApi, cache: redis }) => {

    async function calculateExchangeRate({ from, to, amount, reference }) {
        const cacheKey = `external-${from}-${to}`;
        
        const cached = await cache.getAsync(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const conversion = await getRates({ from, to, reference });
        await cache.setAsync(cacheKey, JSON.stringify(conversion), 'EX', 20);

        const rate = (conversion[to] / conversion[from]);
        
        return {
            [from]: amount,
            [to]: amount * rate,
            [reference]: (1 / conversion[from]) * amount
        };
    }

    return {
        calculateExchangeRate
    }
}