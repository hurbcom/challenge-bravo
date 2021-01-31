require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('../routes');

class App {
    
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
    }
    
    routes() {
        this.app.use('/api/v1/', routes);
    }
}

module.exports = new App();