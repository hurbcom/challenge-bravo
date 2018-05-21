const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config()

app.use(express.static('public'));

app.get("/api*", function(request, response) {
    const from = request.query.from;
    const to = request.query.to;
    const amount = request.query.amount;
    axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.API_KEY}`)
        .then((res) => {
            const rates = res.data.rates;
            // Conversion
            response.json((amount / (1 / rates[to])) * (1 / rates[from]));
        })
        .catch((e) => {
            response.sendStatus(404);
        });
});

const listener = app.listen(8080, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
