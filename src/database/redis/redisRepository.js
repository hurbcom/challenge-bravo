import Redis from 'ioredis'

class RedisRepository extends Redis {
  constructor () {
    super()

    super.on('error', (error) => {
      console.log('Error on Redis')
      console.log(error)
      process.exit(1)
    })

    super.on('connect', () => {})
  }
}

export { RedisRepository }
