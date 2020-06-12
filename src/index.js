const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cronJob = require('cron').CronJob;
const CoinController = require('./app/controllers/CoinController');


const app = express();

mongoose.connect(
    'mongodb://localhost:27017/coinsconversor',
    { useUnifiedTopology: true, useNewUrlParser: true },
    );
    console.log('Banco de dados Mongo conectado;');


new cronJob('0 */5 * * * *', CoinController.updateWEB , null, true, 'America/Sao_Paulo');

app.use(bodyParser.json())
app.use(routes);
app.listen(3333)
console.log("Servidor conectado na porta 3333");


