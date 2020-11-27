const axios = require('axios');
import Redis from '../../databases/redis';
import { env } from '../../config';

async function getRatesFromApi({from, to, reference}) {
    const cacheKey = `external-${from}-${to}`;
    const redis = Redis.instance;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    const response = await axios.get(`${env.api.url}?fsym=${reference}&tsyms=${from},${to}`);
    
    const conversion = response.data;
    await redis.set(cacheKey, JSON.stringify(conversion), 'EX', 20);

    return conversion;
}

export {
    getRatesFromApi
}