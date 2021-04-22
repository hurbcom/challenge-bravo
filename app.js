require("dotenv-safe").config();
const express = require('express');
const currenciesRoutes = require('./src/routes/currencies');
const loginRoutes = require('./src/routes/login');
swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
    require('./src/db'); // Conexão com o banco.
} else {
    require('./src/db-test'); // Conexão com o banco de testes.
}

// Adicionando headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Rotas
// Documentação
const swaggerDocument = require('./swagger.json');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Login
app.use('/login', loginRoutes);
// Currencies
app.use('/currencies', currenciesRoutes);

module.exports = app;