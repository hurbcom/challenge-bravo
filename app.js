'use strict';

// Imports
const dotenv = require('dotenv').config({path: '.env'});
const SwaggerExpress = require('swagger-express-mw');
const express = require('express');
const app = express();
const cors = require('cors');

// Configurações Swagger

app.use(cors());

const config = {
    appRoot: __dirname // required config
};

app.use(express.static('public'));

SwaggerExpress.create(config, (err, swaggerExpress) => {
    if (err) { throw err; }

    // Registrar Middleware
    swaggerExpress.register(app);
    // Definir servidor e porta
    const applicationUrl = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
    // Iniciar o servidor
    app.listen(process.env.SERVER_PORT);
    console.log(`API configurada corretamente e acessível em: ${applicationUrl}`);
});

module.exports = app;
