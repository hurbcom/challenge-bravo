import { Router } from "express";
import providers from '@core/providers';
import ExchangeController from "@controllers/ExchangeController";

const routes = Router();

const ExchangeContainer = providers.container.resolve(ExchangeController);

routes.get('/', (req, res) => res.send(`Olá viajante!`));
routes.get('/exchange', ExchangeContainer.exchange);

export default routes;