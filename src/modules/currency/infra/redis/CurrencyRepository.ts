import Redis, { Redis as RedisClient } from 'ioredis';
import redisConfig from '../../../../config/redis';
import ICurrencyRepository from '../../repositories/ICurrencyRepository';

/**
 * Repository using Redis as database
 */

export default class CurrencyRepository implements ICurrencyRepository {
    private client: RedisClient;
    constructor(){
        this.client = new Redis(redisConfig.config.redis)
    }

    /**
     *
     * @param key
     * @param value
     * Creates a timestamp in the database in unix timestamp
     */
    public async timestamp(key: string, value: number): Promise<void>{
        try{
            await this.client.set(key, value);
          }catch(err){
              throw new Error(err);
          }
    }

    /**
     *
     * @param key
     * @param value
     * adds the currency name and value information based on USD to the database
     */
    public async save(key: string, value: any): Promise<void>{
        try{
          await this.client.set(key, value);
        }catch(err){
            throw new Error(err);
        }
    }
    /**
     *
     * @param key
     * recovers currency information from database based on the given name
     */

    public async recover<T>(key:string): Promise<T | void> {
        const data = await this.client.get(key);
        if(!data){
            return;
        }
        const parsedData = JSON.parse(data) as T;
        return parsedData;
    }
    /**
     *
     * @param key
     * deletes the given currency from the database
     */

    public async invalidate(key: string): Promise<void>{
        await this.client.del(key);
        return;
    }
}