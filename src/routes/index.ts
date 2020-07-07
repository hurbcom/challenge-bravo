import { Router } from 'express';

import CurrencyController from '../controllers/CurrencyController';

const routes = Router();

const currencyController = new CurrencyController();

routes.get('/currency', currencyController.update);
routes.post('/currency', currencyController.create);
routes.get('/currency/index', currencyController.index);

export default routes;
