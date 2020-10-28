import express from 'express';
import compression from 'compression';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import redis from '../config/redis';
import { setInitialSupportedCurrencies } from '../config/initializationProcedures';
import routes from './routes';

const { NODE_ENV = 'development', PORT, REDIS_HOST, REDIS_PASSWORD } = process.env;

const app = express();

redis.configure({host: REDIS_HOST, password: REDIS_PASSWORD});

setInitialSupportedCurrencies();

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

morganBody(app, { prettify: NODE_ENV === 'development' });

app.use(routes);

const port = PORT || 8080;

// TODO configure mongoDB

app.listen({ port }, () => {
    console.info(`Server running on port ${port}`);
});
