import { Router } from 'express';

import { currenciesRouter } from './currencies.routes';
import { currencyConverterRouter } from './currencyConverter.routes';

const routes = Router();

routes.use('/currencies', currenciesRouter);
routes.use('/currency-converter', currencyConverterRouter);

export { routes };
