

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

  const url = `${API_URL}${from_currency}-${to_currency}`;

  return client.get(conversionRedisKey, (err, rate) => {
 
    // If that key exists in Redis store
    if (rate) {
        return res.json({ result: JSON.parse(rate).ticker.price * amount});
    }

    return client.get(inverseConversionRedisKey, (err, rate) => {
      
      // If the mirror key exists in Redis store
      // This saves an external API call
      if (rate) {
        return res.json({ result: amount / (JSON.parse(rate).ticker.price)});
      }
      
      // If the key doesn't exist in Redis store
      axios.get(url).then(response => {
        client.setex(conversionRedisKey, 3600, JSON.stringify(response.data))
        return res.json({ result: response.data.ticker.price * amount});
      }).catch(error => {
        console.log(error);
      });
    });
  });

});

app.listen(80, () => console.log('Server running on port 80!'))