import { Router } from "express";
import ExchangeController from "./app/controllers/ExchangeController";

const routes = Router();

routes.get('/', (req, res) => res.send(`Olá viajante!`));
routes.get('/exchange', ExchangeController.exchange);

export default routes;