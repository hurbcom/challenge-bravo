import 'dotenv/config';
import express from 'express';
import routes from './api/routes';
import resMiddleware from './api/middlewares/res';
import logMiddleware from './api/middlewares/log';
import utils from './libs/Utils';

globalThis.utils = utils;

class App {
    constructor () {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares () {
        this.server.use(express.json());
        this.server.use(resMiddleware);
        this.server.use(logMiddleware);
    }

    routes () {
        this.server.use(routes);
    }
}

const app = new App();

app.server.listen(process.env.APP_PORT);