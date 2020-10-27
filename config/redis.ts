import Redis from 'ioredis';

class RedisClient {
    private redisClient: Redis.Redis | undefined;

    public configure(options: Redis.RedisOptions) : void {
        this.redisClient = new Redis(options);

        this.redisClient.on('connect', () => {
            console.info('The connection with Redis was stablished.');
        });

        this.redisClient.on('close', () => {
            console.info('The connection with Redis was closed.');
        });
    }

    public getClient() : Redis.Redis | never {
        if(!this.redisClient) {
            throw new Error('The Redis client should be configured before requesting its instance.');
        }

        return this.redisClient;
    }
}

export default new RedisClient();
