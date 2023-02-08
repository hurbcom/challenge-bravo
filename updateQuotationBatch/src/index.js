import { getCoinsFromService } from './Services/CoinBase.js'
import { ConnectRedisClient, SetItems } from './Utils/Redis.js'

try {
  console.log('starting script:::')

  const redisConnection = await ConnectRedisClient()
  const coins = await getCoinsFromService()

  await SetItems(redisConnection, coins)

  console.log('finish script with success:::')
} catch (error) {
  console.error('error:::', error)
} finally {
  process.exit()
}
