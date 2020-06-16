require('./bootstrap');
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cronJob = require('cron').CronJob;
const CoinController = require('./app/controllers/CoinController');

const app = express();

//Criando Job Background que executa a cada 5 min para atualizar moedas
new cronJob('0 */5 * * * *', CoinController.updateWEB , null, true, 'America/Sao_Paulo');

app.use(bodyParser.json())
app.use(routes);
app.listen(process.env.APP_PORT)
console.log(`Servidor conectado na porta ${process.env.APP_PORT}`);


