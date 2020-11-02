import express from 'express';
import compression from 'compression';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';
import routes from './routes';
import { currencyCache } from '../config/dependencyInjection';

const { NODE_ENV = 'development', PORT, HOST } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

morganBody(app, { prettify: NODE_ENV === 'development' });

if(NODE_ENV === 'development') {
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(routes);

currencyCache
    .initializeSupportedCurrencies()
    .then((result) => {
        console.info(`The current supported currencies are [${result}].`);

        const host = HOST || 'localhost';
        const port = PORT ? Number.parseInt(PORT) : 8080;

        app.listen(port, host, () => {
            console.info(`Server running on host ${host} and port ${port}.`);
        });
    })
    .catch((err) => {
        console.error(`Error while trying to set add initial currencies. [${err}].`);
    });
