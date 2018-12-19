import express from 'express';
import bodyParse from 'body-parser';
import dotenv from 'dotenv';
import status from 'express-status-monitor';

import routes from './src/routes/routes';
import { updateExchangeRate } from './src/services/quotation-of-the-day.service';
import serverStatusConfig from './src/data/express-status-monitor.json';

const serverStatus = status(serverStatusConfig);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(serverStatus);

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

updateExchangeRate(process.env.EXCHANGE_RATE_PATH);

routes(app);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});

module.exports = app;
