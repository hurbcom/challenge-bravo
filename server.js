import express from 'express';
import bodyParse from 'body-parser';

import routes from './src/routes/routes';
import { updateExchangeRate } from './src/services/currency-conversion.service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

updateExchangeRate('src/data/exchange-rate.json');

routes(app);

app.get('/', (req, res) => {
    res.send('Serve is running...');
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
