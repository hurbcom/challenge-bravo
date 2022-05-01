require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const currencyRoutes = require('./routes/currencies.routes');
const swaggerFile = require('./swagger/swagger_output.json');

const app = express();

app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use('/currency', currencyRoutes);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(PORT, (error) => {
    if (!error) {
    // eslint-disable-next-line no-console
        console.log(`Server is listening on port ${PORT}`);
    } else {
    // eslint-disable-next-line no-console
        console.log('Error occured, server can\'t start', error);
    }
});
