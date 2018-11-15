const express = require('express');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./app/routes/api/api_v1');

app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

app.listen(3000);
