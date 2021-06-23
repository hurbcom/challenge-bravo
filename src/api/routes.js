import { Router } from 'express';
import { CurrencyController, CurrencyConversionController } from './controllers';

const routes = new Router();

// ?from=BTC&to=EUR&amount=123.45
routes.get('/currency', (req, res) => CurrencyController.list(req, res));
routes.get('/currency/convert', (req, res) => CurrencyConversionController.list(req, res));
routes.post('/currency', (req, res) => CurrencyController.store(req, res));
routes.delete('/currency/:symbol', (req, res) => CurrencyController.delete(req, res));

export default routes;