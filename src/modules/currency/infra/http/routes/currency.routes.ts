import { Router } from 'express';

import CurrencyController from '../controllers/CurrencyController';


const currencyController = new CurrencyController();

const currencyRouter = Router();

currencyRouter.post('/create', currencyController.create);
currencyRouter.delete('/remove', currencyController.remove);
currencyRouter.get('/recover', currencyController.recover);
currencyRouter.get('/convert', currencyController.convert);
currencyRouter.get('/fetch', currencyController.fetchCurrencies);

export default currencyRouter;
