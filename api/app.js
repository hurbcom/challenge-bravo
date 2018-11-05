const express           = require('express');
const converterRouter   = require('./routes/converter')
const app               = express();

//TODO: Adicionar tratamentos de erros genericos
app.use('/converter', converterRouter)

module.exports = app;