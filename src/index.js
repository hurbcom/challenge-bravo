const express = require('express')
const bodyParser = require('body-parser')
var app = express();

const cors = require('cors');
require('./database/db');
require('dotenv').config();

// Importa rotas da API
let router = require('./routes/api-routes')

// Configurar porta do server
let port = process.env.SERVER_PORT || 3301;

// Parse de application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse de application/json
app.use(bodyParser.json())

// Enviar mensagem para URL
app.get('/', (req, res) =>
    res.send('Esta é uma API para conversão monetária.')
);

// Iniciar aplicação na porta especificada
module.exports = app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}/`);
});

app.use(cors());

// As rotas da API serão utilizadas após o /api/v1, por ex: /api/v1/currencies/list
app.use('/api/v1', router);