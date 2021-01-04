const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const mongoose = require('mongoose');
const configService = require('./services/configService');

const app = express();
const {
    MONGO_PORT,
    MONGO_HOST,
    MONGO_CURRENCY_COLLECTION,
    PORT
} = process.env;


mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_CURRENCY_COLLECTION}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then( () => {
    console.log('MongoDB Conectado');
  })
  .catch(error => {
    console.error(error);
  });


app.use(helmet());
app.use(routes);
configService.initialCurrencyConfiguration();

app.listen(PORT, () => {
    console.log(`Challenge Bravo server is running on port ${PORT}`);
});