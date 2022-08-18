import { createClient } from 'redis'
import seed from './utils/seed.js'

export const redis = createClient({
    url: process.env.REDIS_URI
})

export default async function initRedis() {
    await redis.connect()
    seed()
}