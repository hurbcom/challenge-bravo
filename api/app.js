const express           = require('express');
const converterRouter   = require('./routes/converter')
const app               = express();

app.use('/converter', converterRouter)

module.exports = app;