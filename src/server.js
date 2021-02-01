const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { setup, container } = require('./config/di-setup');
const middleware = require('./middlewares/HeaderMiddleware');

setup();
const routes = require('./routes/routes');

const updateConversionRatesJob = container.resolve('updateConversionRates');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Challenge Bravo API',
            version: '1.0.0',
            description: 'Challenge Bravo API from HURB that allows to exchange currencies',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);

class Server {
    constructor() {
        this.app = express();
        this.setup();
    }

    setup() {
        this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
        this.app.use(middleware);
        this.app.use(express.json());
        this.app.use('/api', routes);
    }

    run(port) {
        (async () => {
            this.app.listen(port, () => {
                console.log(`Server running on http://localhost:${port}`);
            });

            await updateConversionRatesJob.initJob();
        })();
    }

    stop(done) {
        this.server.close(done);
    }
}

module.exports = Server;
