import 'dotenv/config';
import express from 'express';
import routes from './api/routes';

class App {
    constructor () {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares () {
        this.server.use(express.json());
    }

    routes () {
        this.server.use(routes);
    }
}

const app = new App();

app.server.listen(process.env.APP_PORT);