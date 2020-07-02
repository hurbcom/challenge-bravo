import { Router } from "express";
import providers from '@core/providers';
import ExchangeController from "@controllers/ExchangeController";
import CurrencyController from "@controllers/CurrencyController";

const routes = Router();

const ExchangeContainer = providers.container.resolve(ExchangeController);
const CurrencyContainer = providers.container.resolve(CurrencyController);

routes.get('/exchange', ExchangeContainer.exchange);
routes.get('/currency', CurrencyContainer.index);

export default routes;