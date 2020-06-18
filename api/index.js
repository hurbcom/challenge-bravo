require('module-alias/register') //importando alias
const Server = require('@src/startServer') //importando classe Server
const updateValueCoins = require('./src/jobs/update-value-coins') //Job para atualizar moedas

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` }) //configurando dotenv

const configs = {
    //dependencias e rotas para inicializar o servidor
    dependencies: {
        express: require('express'),
        logger: require('morgan'),
        cors: require('cors'),
        bodyParser: require('body-parser'),
        swaggerUi: require('swagger-ui-express'),
        scheduler: require('@utils/scheduler'),
        mongoose: require('mongoose'),
    },
    routes: require('@src/routes'),
}

const server = new Server(configs) //criando a classe do servidor
if (process.env.JOB) {
    //inicializando job e executando-o de 5 em 5 minutos
    server.scheduleJob(1000 * 60 * 5, updateValueCoins, true)
}

server.start() //inicializando servidor
