const express = require('express');
const routes = require('./routes');

const cors = require('./app/middlewares/cors');

const server = express();

const port = process.env.PORT || 3000;

server.use(cors);
server.use(routes);

// Checagem necessária para evitar conflitos de porta ao rodar os testes
if (process.env.ENV !== 'test') {
    server.listen(port, () => {
        console.log(`Server running at ${port}`);
    });
}

module.exports = server;
