const express          = require('express');
const currencyRouter   = require('./routes/currency')

const app               = express();

app.use('/currency', currencyRouter)

module.exports = app;