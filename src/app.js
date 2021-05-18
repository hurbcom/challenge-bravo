const express = require('express');
const routes = require('./routes/v1');

const app = express();

app.use('/v1', routes);

module.exports = app;
