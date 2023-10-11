import Redis from 'ioredis'
import 'dotenv/config'

class RedisRepository extends Redis {
  constructor () {
    super(process.env.DATABASE_REDIS_URL)

    super.on('error', (error) => {
      console.log('Error on Redis')
      console.log(error)
      process.exit(1)
    })

    super.on('connect', () => {})
  }
}

export { RedisRepository }
