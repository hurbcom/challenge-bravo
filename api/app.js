
const express           = require('express');
const app               = express();

app.use('/currency', require('./controllers/converter'))

module.exports = app;
