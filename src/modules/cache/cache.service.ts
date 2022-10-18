import { apiConfigs } from "../../configs/api.config";
import { redisClient } from "../../configs/redis.config";

export class CacheService {
  public async getRedisCache(key: string): Promise<string> {
    const redisGet = await redisClient.get(key)
    return redisGet
  }
  
  public async setRedisCache(key: string, value: string): Promise<'OK'> {
    const redisSet = await redisClient.set(key, value, 'EX', apiConfigs.externalApi.updateTimeInSec)
    return redisSet
  }
}