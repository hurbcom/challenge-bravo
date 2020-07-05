import { Router } from "express";
import providers from '@core/providers';
import ExchangeController from "@controllers/ExchangeController";
import CurrencyController from "@controllers/CurrencyController";

const routes = Router();

const ExchangeContainer = providers.container.resolve(ExchangeController);
const CurrencyContainer = providers.container.resolve(CurrencyController);

routes.get('/exchange', ExchangeContainer.exchange);
routes.get('/currencies/:id', CurrencyContainer.find);
routes.delete('/currencies/:id', CurrencyContainer.delete);
routes.get('/currencies', CurrencyContainer.index);
routes.post('/currencies', CurrencyContainer.create);

export default routes;