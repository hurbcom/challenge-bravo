const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(
        'mongodb://localhost:27017/coinsconversor',
        { useUnifiedTopology: true, useNewUrlParser: true },
    );
console.log('Banco de dados Mongo conectado;');

app.use(bodyParser.json())
app.use(routes);
app.listen(3333)
console.log("Servidor conectado na porta 3333");


