
require('dotenv').config()
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/hurb',
  port: process.env.PORT || 3000,
  freeCurrencyApiURL: process.env.FREE_CURRENCY_API || 'https://freecurrencyapi.net/',
  freeCurrencyApikey: process.env.FREE_CURRENCY_API_KEY || '9e740500-538f-11ec-ba89-979819140bc8'

}
