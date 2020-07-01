import Redis, { Redis as RedisClient } from 'ioredis';
import redisConfig from '../../../../config/redis';
import ICurrencyRepository from '../../repositories/ICurrencyRepository';


const client = new Redis(redisConfig.config.redis);

/**
 * Repository using Redis as database
 */
export default class CurrencyRepository implements ICurrencyRepository {


    /**
     *
     * @param key
     * @param value
     * Creates a timestamp in the database in unix timestamp
     */
    public async timestamp(): Promise<void>{
        try{
            await client.set('_timestamp', new Date().getTime());
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
    public async save(name: string, value: number): Promise<void>{
        try{
          await client.set(name, value);
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
        const data = await client.get(key);
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
        await client.del(key);
        return;
    }
}