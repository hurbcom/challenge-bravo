require('dotenv').config();
const express = require('express');
const cors = require('cors');
const client = require('prom-client');
const fs = require('fs');
const path = require('path');

const routes = require('../routes');

class App {
    
    constructor() {
        this.app = express();
        this.middlewares();
        this.metrics();
        this.routes();
        this.setAvailableCurrencies();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }
    
    routes() {
        this.app.get('/metrics', async (req, res) => {
            res.set('Content-Type', client.register.contentType);
            const metrics = await client.register.metrics();
            res.end(metrics);
        });

        this.app.use('/api/v1/', routes);
    }

    metrics() {
        const collectDefaultMetrics = client.collectDefaultMetrics;
        const prefix = 'Bravo';
        collectDefaultMetrics({ prefix });
    }

    setAvailableCurrencies() {
        let data = [];

        try {
            data = fs.readFileSync(path.resolve("src", "available_currencies"))
                        .toString()
                        .split('\n')
                        .map(e => e.trim());
        } catch (e) {
            data = [ 'USD', 'BRL', 'EUR', 'BTC', 'ETH' ];
        }

        global.available_currencies = data;
    }
}

module.exports = new App();