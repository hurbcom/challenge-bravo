const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const routes = require('./app/routes/api/api_v1');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

module.exports = app;
