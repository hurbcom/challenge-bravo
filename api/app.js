
const express           = require('express');
const converterRouter   = require('./routes/converter')

const app               = express();

app.use('/currency', converterRouter)

module.exports = app;