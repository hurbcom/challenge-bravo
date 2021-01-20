const express = require('express');
const { dbConnect } = require('./db/database_handler');

const routes = require('./routes');

class App {
    constructor() {
        this.express = express();

        dbConnect();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json());
    }

    routes() {
        this.express.use(routes);
    }
}

module.exports = new App().express;