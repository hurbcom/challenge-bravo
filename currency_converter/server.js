

const express = require('express'); //Web framework of choice
//const path = require('path');
const axios = require('axios'); //HTTP promises
const redis = require('redis'); //Caching solution
const fs = require('fs'); //Required for system-level file handling
const client = redis.createClient({
  host: 'redis',
  port: 6379
});

const app = express();
let currencies = JSON.parse(fs.readFileSync('currencies.json', 'utf-8')) //A simply JSON is enough for our purposes

const API_URL = 'https://api.cryptonator.com/api/ticker/';

client.on('connect', () => {
  console.log('REDIS READY');
 });
client.on('error', err => {
  console.log(`Redis error: ${err}`);
});

app.get('/api', (req, res) => {
  const from_currency = req.query.from;
  const to_currency = req.query.to;
  const amount = req.query.amount;

  if (!currencies.table.includes(from_currency))
    return res.json({ error: `Currency ${from_currency} not supported`});
  
  if (!currencies.table.includes(to_currency))
    return res.json({ error: `Currency ${to_currency} not supported`});

  const conversionRedisKey = `${from_currency}:${to_currency}`;
  const inverseConversionRedisKey = `${to_currency}:${from_currency}`;

  const URL = `${API_URL}${from_currency}-${to_currency}`;
  const inverseURL = `${API_URL}${to_currency}-${from_currency}`;

  return client.get(conversionRedisKey, (err, rate) => {
 
    // If that key exists in Redis store
    if (rate) {
        return res.json({ result: JSON.parse(rate).ticker.price * amount});
    }
      
      // First we save, asynchronously, the mirror key in Redis store
      axios.get(inverseURL).then(response => {
        console.log('Inverse price:')
        console.log(response.data.ticker.price)
        client.setex(inverseConversionRedisKey, 3600, JSON.stringify(response.data))
      }).catch(error => {
        console.log(error);
      });
      
      // Then we fetch the actual key and return the converted value
      axios.get(URL).then(response => {
        console.log('Price:')
        console.log(response.data.ticker.price)
        client.setex(conversionRedisKey, 3600, JSON.stringify(response.data))
        return res.json({ result: response.data.ticker.price * amount});
      }).catch(error => {
        console.log(error);
      });
  });

});

app.listen(8000, () => console.log('Server running on port 8000!'))