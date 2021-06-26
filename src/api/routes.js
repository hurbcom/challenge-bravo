import { Router } from 'express';
import { CurrencyController, CurrencyConversionController } from './controllers';
import * as validationMiddleware from './middlewares/validation';

const routes = new Router();

// ?from=BTC&to=EUR&amount=123.45
routes.get('/currency', (req, res) => CurrencyController.list(req, res));
routes.get('/currency/convert', validationMiddleware.currencyConversion, (req, res) => CurrencyConversionController.list(req, res));
routes.post('/currency', validationMiddleware.currency, (req, res) => CurrencyController.store(req, res));
routes.delete('/currency/:currencyCode', (req, res) => CurrencyController.delete(req, res));

export default routes;