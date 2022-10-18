import Redis from "ioredis";
import 'dotenv/config'

export const redisClient = new Redis(process.env.REDIS_HOST)
