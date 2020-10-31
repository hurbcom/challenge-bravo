import express from 'express';
import compression from 'compression';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';
import routes from './routes';
import { currencyCache } from '../config/dependencyInjection';

const { NODE_ENV = 'development', PORT } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

morganBody(app, { prettify: NODE_ENV === 'development' });

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

currencyCache
    .initializeSupportedCurrencies()
    .then((result) => {
        console.info(`The current supported currencies are [${result}].`);

        const port = PORT || 8080;

        app.listen({ port }, () => {
            console.info(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(`Error while trying to set add initial currencies. [${err}].`);
    });
