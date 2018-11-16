const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const routes = require('./app/routes/api/api_v1');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

app.listen(PORT);

module.exports = app;
