const express = require('express');
const { setup, container } = require('./config/di-setup');
const middleware = require('./middlewares/HeaderMiddleware');

setup();
const routes = require('./routes/routes');

const updateConversionRatesJob = container.resolve('updateConversionRates')

class Server {
    constructor() {
        this.app = express();
        this.setup();
    }

    setup() {
        this.app.use(middleware);
        this.app.use(express.json());
        this.app.use('/api', routes);
    }

    run(port) {
        (async () => {
            this.app.listen(port, () => {
                console.log(`Server running on http://localhost:${port}`)
            }); 

            await updateConversionRatesJob.initJob();
        })();
    }

    stop(done) {
        this.server.close(done);
    }
}

module.exports = Server; 