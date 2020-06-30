import { Router } from 'express';

import currencyRouter from '../../../modules/currency/infra/http/routes/currency.routes';

const routes = Router();

routes.use('/currency', currencyRouter);

export default routes;
