import * as yup from "yup";
import { Router } from "express";

import ExchangeController from "@controllers/ExchangeController";
import CurrencyController from "@controllers/CurrencyController";
import validateRequest from "@middlewares/validate-request";
import types from "@core/types";
import providers from "@core/providers";
import swagger from "@config/swagger";
import swaggerUI from "swagger-ui-express";

const routes = Router();

const ExchangeContainer = providers.container.get<ExchangeController>(types.ExchangeController);
const CurrencyContainer = providers.container.get<CurrencyController>(types.CurrencyController);

routes.use('/docs', swaggerUI.serve, swaggerUI.setup(swagger, { explorer: true }));

routes.get('/exchange', validateRequest({
  from: yup.string().required(),
  to: yup.string().required(),
  amount: yup.number().required()
}), ExchangeContainer.exchange);

routes.get('/currencies/:id', CurrencyContainer.find);

routes.delete('/currencies/:id', CurrencyContainer.delete);

routes.put('/currencies/:id', validateRequest({
  name: yup.string(),
  symbol: yup.string()
}), CurrencyContainer.update);

routes.get('/currencies', CurrencyContainer.index);

routes.post('/currencies', validateRequest({
  name: yup.string().required(),
  symbol: yup.string().required()
}, 'body'), CurrencyContainer.create);

export default routes;