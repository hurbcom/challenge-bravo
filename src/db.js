import { createClient } from 'redis'
import seed from './utils/seed.js'

export const redis = createClient({
	url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})

export default async function initRedis() {
	await redis.connect()
	seed()
}
