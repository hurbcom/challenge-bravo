import { Router } from 'express';

import { CurrenciesController } from '../controllers/CurrenciesController';

const currenciesRouter = Router();
const currenciesController = new CurrenciesController();

currenciesRouter.post('/', currenciesController.store);

currenciesRouter.get('/', currenciesController.index);

currenciesRouter.get('/:currencyId', currenciesController.show);

currenciesRouter.put('/:currencyId', currenciesController.update);

currenciesRouter.delete('/:currencyId', currenciesController.destroy);

export { currenciesRouter };
