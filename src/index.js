const express = require('express')
const bodyParser= require('body-parser')
var app = express();

const cors = require('cors');
require("./server/db");

// Importa router
let router = require("./routes/api-routes")

// Configurar porta do server
let port = process.env.PORT || 3301;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

 // Enviar mensagem para URL
app.get('/', (req, res) => 
    res.send('Esta é uma API para conversão monetária.')
);

// Iniciar aplicação na porta específica
app.listen(port, () => {
    console.log("API rodando em http://localhost:3301/");
});

app.use(cors());

app.use('/', router);