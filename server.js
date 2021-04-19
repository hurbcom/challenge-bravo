const express = require('express');
const currenciesRoutes = require('./src/routes/currencies');

const app = express();

require('./src/db'); // Conexão com o banco.

// Adicionando headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Rotas
app.use('/currencies', currenciesRoutes);

// Server
const port = 8000;
app.listen(port, () => {
    console.log('Servidor em execução na porta: ' + port);
});