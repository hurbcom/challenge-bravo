require('dotenv/config');

const env = 'dev';

const mongoString = process.env.MONGO_ADDRESS


module.exports.enums = Object.freeze({
  mongo: {
    connString: process.env.MONGO_ADDRESS,
  },
  apiPort: process.env.API_PORT,

});

console.log("Conectado ao:", mongoString);