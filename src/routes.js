import { Router } from 'express';
import cors from 'cors';

import ConversionController from './app/controllers/ConversionController';
import CurrencyController from './app/controllers/CurrencyController';
import PingController from './app/controllers/PingController';

const routes = new Router();
routes.use(cors());

// ping to health of api
routes.get('/ping', (req, res, next) => PingController.get(req, res, next).catch(next));

// return all currencys
routes.get('/currency', (req, res, next) => CurrencyController.list(req, res, next).catch(next));

// create a currency if they don't exists
routes.post('/currency', (req, res, next) => CurrencyController.create(req, res, next).catch(next));

// delete a currency (name passed by params)
routes.delete('/currency', (req, res, next) => CurrencyController.delete(req, res, next).catch(next));

// convert two currency
routes.get('/convert', (req, res, next) => ConversionController.index(req, res, next).catch(next));

export default routes;
