import { RedisMemoryServer } from "redis-memory-server";

module.exports = async function () {
    const redisServer = new RedisMemoryServer();
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();
    process.env.REDIS_URL = `redis://${host}:${port}`;
};
