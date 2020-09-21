import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { CurrencyController } from './controllers/CurrencyController'
import { ExchangeController } from './controllers/ExchangeController'


const routes = express.Router();
const currencyController = new CurrencyController();
const exchangeController = new ExchangeController();

// currency
routes.get('/currency', currencyController.Index);
routes.get('/currency/:codigo', currencyController.Show);
routes.delete('/currency/:codigo', currencyController.Delete);

// exchange
routes.post(
    '/currency',
    celebrate({
        body: Joi.object().keys({
            codigo: Joi.string().required().min(3).max(3),
            data: Joi.string(),
            cotacao: Joi.number().required()
        })
    }),
    currencyController.Create);

routes.get('/exchange/converter',
    celebrate({
        [Segments.QUERY]: {
            from: Joi.string().required().min(3).max(3),
            to: Joi.string().required().min(3).max(3),
            amount: Joi.number().required()
        }
    }),
    exchangeController.Converter);


routes.get('/exchange/lastest', exchangeController.Latest);

export default routes;

