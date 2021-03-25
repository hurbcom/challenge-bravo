require('dotenv/config');

const env = 'dev';

const mongoString = process.env.MONGO_ADDRESS


module.exports.enums = Object.freeze({
  mongo: {
    connString: process.env.MONGO_ADDRESS,
  },
  apiPort: process.env.API_PORT,
  apiCoin: {
    url: process.env.API_COIN,
    key: process.env.API_COIN_KEY
  },
  apiCrypto:{
    url: process.env.API_CRYPTO,
    key: process.env.API_CRYPTO_KEY
  }
});

console.log("Connected to:", mongoString);