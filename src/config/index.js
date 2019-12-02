import dotenv from 'dotenv'

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

export default {
  app: {
    port: process.env.PORT || 3333
  },
  db: {
    uri: process.env.DB_URI
  },
  services: {
    api_key: process.env.API_KEY
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
}
