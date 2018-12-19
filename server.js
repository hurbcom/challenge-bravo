import express from 'express';
import bodyParse from 'body-parser';
import dotenv from 'dotenv';

import routes from './src/routes/routes';
import { updateExchangeRate } from './src/services/quotation-of-the-day.service';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

updateExchangeRate(process.env.EXCHANGE_RATE_PATH);

routes(app);

app.get('/', (req, res) => {
    res.send('Serve is running...');
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});

module.exports = app;
