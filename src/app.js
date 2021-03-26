const express = require('express');
const sendError = require('../src/helper/sendError');
const rateLimit = require('../src/middleware/rateLimit');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());



app.use(sendError);

app.use(...rateLimit);

app.use(routes);

module.exports = app;