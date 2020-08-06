import { Router } from 'express';
import { convertValidator } from './validators/ConvertionValidator';
import {
    convert,
    addCurrency,
    removeCurrency,
    getCurrencies,
} from './controllers/ConversionsController';
import {
    addCurrencyValidator,
    removeCurrencyValidator,
} from './validators/CurrencyValidator';

const routes = Router();

routes.get('/', (req, res) => {
    return res.status(200).send({
        message: 'running...',
    });
});
routes.get('/bravo/v1/convertions', convertValidator, convert);
routes.get('/bravo/v1/currencies', getCurrencies);
routes.post('/bravo/v1/currencies', addCurrencyValidator, addCurrency);
routes.delete('/bravo/v1/currencies', removeCurrencyValidator, removeCurrency);

export default routes;
