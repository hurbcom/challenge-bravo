require('dotenv').config();
const express = require('express');

const routes = require('./src/routes/routes');
const middleware = require('./src/middlewares/HeaderMiddleware');

const UpdateConversionRates = require('./src/jobs/UpdateConversionRates');

const app = express();
const port = process.env.PORT ? process.env.PORT: 3000;

app.use(middleware);
app.use(express.json());
app.use('/api', routes);


(async () => {
    app.listen(port, () => {
        console.log(`App Running on http://localhost:'${port}'`)
    });

    await UpdateConversionRates.initJob();
})();
