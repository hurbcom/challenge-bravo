import 'dotenv/config'

export default {
  app: {
    port: process.env.PORT || 3333
  },
  db: {
    uri: process.env.DB_URI
  },
  services: {
    api_key: process.env.API_KEY
  }
}
