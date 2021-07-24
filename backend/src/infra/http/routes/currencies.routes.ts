import { Router } from 'express';

import { CurrenciesController } from '../controllers/CurrenciesController';

const currenciesRouter = Router();
const currenciesController = new CurrenciesController();

currenciesRouter.post('/', currenciesController.store);

currenciesRouter.get('/', currenciesController.index);

currenciesRouter.get('/:code', currenciesController.show);

currenciesRouter.put('/:code', currenciesController.update);

currenciesRouter.delete('/:code', currenciesController.destroy);

export { currenciesRouter };
