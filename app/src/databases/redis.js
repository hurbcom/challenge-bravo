import * as redis from 'redis';
import { promisify } from 'util';
import ExpressRedisCache from 'express-redis-cache';
import env from '../config/env';

const singleton = Symbol();
const singletonEnforcer = Symbol()

class Redis {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) {
            throw new Error('Cannot instantiate redis singleton');
        }
        const client = redis.createClient({
            host: env.redis.host
        });
        
        client.getAsync = promisify(client.get).bind(client);
        client.setAsync = promisify(client.set).bind(client);

        this._client = client;

        this._httpCache = ExpressRedisCache({
            client: client,
            expire: 10, 
        });
    }

    /**
     * @returns {Redis} a Redis instance
     */
    static get instance() {
        if (!this[singleton]) {
          this[singleton] = new Redis(singletonEnforcer);
        }
    
        return this[singleton];
      }
    

    async get(key) {
        return await this._client.getAsync(key);
    }

    async set(key, value) {
        return await this._client.setAsync(key, value);
    }

    client() {
        return this._client;
    }

    httpCache() {
        return this._httpCache;
    }
}

export default Redis;