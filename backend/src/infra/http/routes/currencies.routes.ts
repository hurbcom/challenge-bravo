import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { CurrenciesController } from '../controllers/CurrenciesController';

const currenciesRouter = Router();
const currenciesController = new CurrenciesController();

currenciesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      code: Joi.string().required(),
      backingCurrency: {
        code: Joi.string().required(),
        amount: Joi.number().min(0),
      },
    },
  }),
  currenciesController.store,
);

currenciesRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(50),
    },
  }),
  currenciesController.index,
);

currenciesRouter.get(
  '/:code',
  celebrate({
    [Segments.PARAMS]: {
      code: Joi.string().required(),
    },
  }),
  currenciesController.show,
);

currenciesRouter.put(
  '/:code',
  celebrate({
    [Segments.PARAMS]: {
      code: Joi.string().required(),
    },
  }),
  currenciesController.update,
);

currenciesRouter.delete(
  '/:code',
  celebrate({
    [Segments.PARAMS]: {
      code: Joi.string().required(),
    },
  }),
  currenciesController.destroy,
);

export { currenciesRouter };
