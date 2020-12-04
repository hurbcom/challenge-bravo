require('dotenv').config();

module.exports = {
  development: {
    username: '',
    password: '',
    host: '',
    dialect: "sqlite",
    storage: "./sqlite-dev.db"
  },
  test: {
    username: '',
    password: '',
    host: '',
    dialect: "sqlite",
    storage: "./sqlite-test.db"
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
};
