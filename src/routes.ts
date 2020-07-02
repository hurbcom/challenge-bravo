import { Router } from "express";
import providers from '@core/providers';
import ExchangeController from "@controllers/ExchangeController";
import CurrencyController from "@controllers/CurrencyController";

const routes = Router();

const ExchangeContainer = providers.container.resolve(ExchangeController);
const CurrencyContainer = providers.container.resolve(CurrencyController);

routes.get('/exchange', ExchangeContainer.exchange);
routes.get('/currency', CurrencyContainer.index);
routes.get('/currency/:id', CurrencyContainer.find);
routes.get('/currency/symbol/:symbol', CurrencyContainer.findBySymbol);
routes.post('/currency', CurrencyContainer.create);
routes.delete('/currency/:id', CurrencyContainer.delete);
export default routes;