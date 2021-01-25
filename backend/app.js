const express = require('express');
const cors = require('cors');
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
        this.express.use(cors());
    }

    routes() {
        this.express.use(routes);
    }
}

module.exports = new App().express;