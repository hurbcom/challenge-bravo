import redis from 'redis'

import config from '../config'

const client = redis.createClient({
  host: config.redis.host,
  port: config.redis.port
})

client.on('error', error => {
  console.log(`> Redis error: ${error}`)
})

client.on('connect', () => {
  console.log('> Connected to redis')
})

export default client
