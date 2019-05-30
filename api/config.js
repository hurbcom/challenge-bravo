const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    endpoint: process.env.API_CRYPTOCOMPARE_URL,
    masterKey: process.env.API_CRYPTOCOMPARE_KEY,
    porta: process.env.PORT
};