import Redis from 'ioredis';

export const SUPPORTED_VALUES_KEY = 'currencies:supported';

class RedisClient {
    private static redisClient: Redis.Redis | undefined;

    public configure(options: Redis.RedisOptions) : void {
        RedisClient.redisClient = new Redis(options);

        RedisClient.redisClient.on('connect', () => {
            console.info('The connection with Redis was stablished.');
        });

        RedisClient.redisClient.on('close', () => {
            console.info('The connection with Redis was closed.');
        });
    }

    public getClient() : Redis.Redis | never {
        if(!RedisClient.redisClient) {
            throw new Error('The Redis client should be configured before requesting its instance.');
        }

        return RedisClient.redisClient;
    }
}

export default new RedisClient();
