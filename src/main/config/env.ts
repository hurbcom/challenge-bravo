
require('dotenv').config()
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/hurb',
  port: process.env.PORT || 3000
}
