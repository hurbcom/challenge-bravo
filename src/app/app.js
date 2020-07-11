const express = require('express');
const cors = require('cors');
const currenciesRoutes = require('./src/routes/currencies');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', currenciesRoutes);

module.exports = app;
