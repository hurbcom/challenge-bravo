import { Router } from 'express';
import { CurrencyControllerFactory } from '../factories/controllers/currency.controller';
export const currencyRouter = Router();
const currencyController = CurrencyControllerFactory.create();

currencyRouter.get('/currency/convert', currencyController.convertCurrency.bind(currencyController));

currencyRouter.post('/currency/create', currencyController.createCurrency.bind(currencyController));

currencyRouter.delete('/currency/delete', currencyController.deleteCurrency.bind(currencyController));