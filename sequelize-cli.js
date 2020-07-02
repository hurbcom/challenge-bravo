const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

module.exports = {
  dialect: process.env.DATABASE_DIALECT || 'sqlite',
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  modelPaths: [__dirname + './src/app/models'],
  storage: process.env.DATABASE_STORAGE,
  logging: false
}