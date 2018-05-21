const express = require('express');
const cache = require('memory-cache');
const axios = require('axios');
const app = express();
require('dotenv').config()

app.use(express.static('public'));

app.get("/api*", function(request, response) {
    const from = request.query.from;
    const to = request.query.to;
    const amount = request.query.amount;

    let current = (new Date().getTime() + '');
    current = parseInt(current.substr(0, current.length - 3));

    if (cache.get('lastTime') === null) {
        cache.put('lastTime', current);
        axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.API_KEY}`)
            .then((res) => {
                const rates = res.data.rates;
                // Cache Rates
                cache.put('rates', JSON.stringify(rates));
                // Conversion
                response.json((amount / (1 / rates[to])) * (1 / rates[from]));
            })
            .catch((e) => {
                response.sendStatus(404);
            });
    } else if (current - cache.get('lastTime') > 60) {
        cache.put('lastTime', current);
        axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.API_KEY}`)
            .then((res) => {
                const rates = res.data.rates;
                // Cache Rates
                cache.put('rates', JSON.stringify(rates));
                // Conversion
                response.json((amount / (1 / rates[to])) * (1 / rates[from]));
            })
            .catch((e) => {
                response.sendStatus(404);
            });
    } else {
      let rates = JSON.parse(cache.get('rates'));
      response.json((amount / (1 / rates[to])) * (1 / rates[from]));
    }

});

const listener = app.listen(8080, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
