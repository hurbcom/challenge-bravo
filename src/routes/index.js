import { Router } from 'express';
import CurrencyController from './currencyController';

const routes = Router();

routes.get('/currency', CurrencyController.getCurrencyExchange);

export default routes;