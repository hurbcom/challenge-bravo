import { Router } from "express";

import { CreateExchangeController } from "@modules/exchanges/useCases/createExchange/CreateExchangeController";

const exchangeRoutes = Router();

const createExchangeController = new CreateExchangeController();

exchangeRoutes.get("/", createExchangeController.handle);

export { exchangeRoutes };
