import { Router } from 'express';

import { CurrencyConverterController } from '../controllers/CurrencyConverterController';

const currencyConverterRouter = Router();
const currencyConverterController = new CurrencyConverterController();

currencyConverterRouter.get('/', currencyConverterController.show);

export { currencyConverterRouter };
