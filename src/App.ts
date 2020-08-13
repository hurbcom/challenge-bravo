import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { addCurrency, removeCurrency, convert, getCurrencies } from './controllers/ConversionsController';
import { addCurrencyValidator, removeCurrencyValidator } from './validators/CurrencyValidator';
import { convertValidator } from './validators/ConvertionValidator';
import bodyParser from 'body-parser';
import { environment } from './environments/environment';

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.get('/bravo/v1/currencies', getCurrencies)
app.post('/bravo/v1/currencies', addCurrencyValidator, addCurrency);
app.delete('/bravo/v1/currencies', removeCurrencyValidator, removeCurrency);
app.get('/bravo/v1/convertions', convertValidator, convert);
database();

function database(): void {
    mongoose.connect('mongodb://' + environment.mongoHost + ':27017',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
}

export default app;