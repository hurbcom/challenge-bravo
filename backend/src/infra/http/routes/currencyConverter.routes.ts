import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { CurrencyConverterController } from '../controllers/CurrencyConverterController';

const currencyConverterRouter = Router();
const currencyConverterController = new CurrencyConverterController();

currencyConverterRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      from: Joi.string().required(),
      to: Joi.string().required(),
      amount: Joi.number().required(),
    },
  }),
  currencyConverterController.show,
);

export { currencyConverterRouter };
