import { Router } from 'express';
import currencyRouter from './currency.routes';

const routes = Router();
routes.use('/currencies', currencyRouter);

export default routes;
